import { redirect } from 'next/navigation';

const VERCEL_URL = 'https://governance.prizym.aicoderally.com';

export default function PrizymGovernanceRedirect() {
  redirect(VERCEL_URL);
}
