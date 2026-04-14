#!/usr/bin/env bash
# sync-cf-secrets — diff Cloudflare Secrets Store against macOS Keychain
#
# Lists the secrets in the CF default Secrets Store, maps each CF name to its
# expected keychain counterpart (aicr-tools-* convention), and prints a status
# line per secret: IN_SYNC / MISSING_IN_KEYCHAIN / UNKNOWN_MAPPING.
#
# CF Secrets Store values are never readable by the API — only names/metadata.
# This script is a "does every CF secret have a local keychain mirror" check,
# not a value-level diff. If you add a secret on one side, manually add it to
# the other and re-run this script to verify.
#
# Requires:
#   - `cf_secrets_token` in macOS Keychain with CF Secrets Store read scope
#   - `wrangler` installed (auto-installs via npx)
#   - CF account ID + store ID (baked in below — update if they change)
#
# Usage:
#   ./scripts/sync-cf-secrets.sh
#
# Exit codes:
#   0  everything in sync
#   1  at least one CF secret missing in keychain or unknown mapping

set -euo pipefail

readonly STORE_ID="533dd34d6f37442ba6e2e7a7fe491533"
readonly KEYCHAIN_TOKEN_NAME="cf_secrets_token"

# Mapping from CF Secrets Store name → expected macOS Keychain service name.
# Keep these in sync when you add or rotate secrets on either side.
declare -a CF_TO_KEYCHAIN=(
  # anthro-01 deprecated 2026-04-13 — no longer exists in CF Secrets Store
  "aicr_anthropic_anthro-02:aicr-tools-ANTHROPIC_API_KEY_2"
  "aicr_anthropic_anthro-03:aicr-tools-ANTHROPIC_API_KEY_3"
  "aicr_openai_openai-01:aicr-tools-OPENAI_API_KEY"
  "aicr_google-ai-studio_google-01:aicr-tools-GOOGLE_API_KEY"
  "aicr_openrouter_aicr-or-ai:aicr-tools-OPENROUTER_API_KEY"
)

lookup_keychain_name() {
  local cf_name="$1"
  for entry in "${CF_TO_KEYCHAIN[@]}"; do
    if [[ "${entry%%:*}" == "$cf_name" ]]; then
      echo "${entry##*:}"
      return 0
    fi
  done
  return 1
}

keychain_has() {
  security find-generic-password -s "$1" >/dev/null 2>&1
}

# Fetch the CF token from keychain — never echo it.
if ! TOKEN=$(security find-generic-password -s "$KEYCHAIN_TOKEN_NAME" -w 2>/dev/null); then
  echo "ERROR: keychain entry '$KEYCHAIN_TOKEN_NAME' not found." >&2
  echo "Create it with: security add-generic-password -s $KEYCHAIN_TOKEN_NAME -a \$USER -w '<token>'" >&2
  exit 2
fi

# List CF secrets (name column only).
echo "Listing Cloudflare Secrets Store ($STORE_ID)..."
CF_NAMES=$(
  CLOUDFLARE_API_TOKEN="$TOKEN" \
    npx --yes wrangler secrets-store secret list "$STORE_ID" --remote --per-page 100 2>/dev/null |
    awk -F'│' '/^│ aicr/ { gsub(/ /,"",$2); print $2 }'
)

if [[ -z "$CF_NAMES" ]]; then
  echo "ERROR: no secrets returned from Cloudflare. Token may lack scope or store is empty." >&2
  exit 2
fi

printf "\n%-40s %-40s %s\n" "CF SECRET NAME" "KEYCHAIN SERVICE" "STATUS"
printf '%s\n' "$(printf '=%.0s' {1..100})"

missing=0
unknown=0
synced=0

while IFS= read -r cf_name; do
  [[ -z "$cf_name" ]] && continue
  if kc_name=$(lookup_keychain_name "$cf_name"); then
    if keychain_has "$kc_name"; then
      printf "%-40s %-40s \033[32mIN_SYNC\033[0m\n" "$cf_name" "$kc_name"
      synced=$((synced + 1))
    else
      printf "%-40s %-40s \033[31mMISSING_IN_KEYCHAIN\033[0m\n" "$cf_name" "$kc_name"
      missing=$((missing + 1))
    fi
  else
    printf "%-40s %-40s \033[33mUNKNOWN_MAPPING\033[0m\n" "$cf_name" "(add to CF_TO_KEYCHAIN)"
    unknown=$((unknown + 1))
  fi
done <<< "$CF_NAMES"

echo ""
echo "Summary: $synced in sync, $missing missing in keychain, $unknown unknown mapping"

if (( missing > 0 || unknown > 0 )); then
  exit 1
fi
