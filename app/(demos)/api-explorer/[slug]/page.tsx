'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import manifest from '../../../../data/services-manifest.json';
import { TryItPanel } from '../../../../components/api-explorer/TryItPanel';
import { playgrounds } from '../../../../components/api-explorer/playgrounds';
import { GatewayHealth } from '../../../../components/api-explorer/GatewayHealth';

const GATEWAY_URL = 'https://api.aicoderally.com';

export function generateStaticParams() {
  return manifest.services.map((s) => ({ slug: s.slug }));
}

type Rpc = (typeof manifest.services)[0]['rpcs'][0];

function HttpBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/20 text-emerald-400',
    POST: 'bg-blue-500/20 text-blue-400',
    PUT: 'bg-amber-500/20 text-amber-400',
    PATCH: 'bg-orange-500/20 text-orange-400',
    DELETE: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${colors[method] ?? 'bg-gray-500/20 text-gray-400'}`}>
      {method}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="rounded bg-white/5 px-2 py-1 text-xs text-[#888] hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <div className="relative rounded-lg border border-[#1a2a2e] bg-[#0a1012] p-4 font-mono text-sm">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-[#555]">{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto text-[#ccc] leading-relaxed whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

function RpcRow({ rpc, servicePkg }: { rpc: Rpc; servicePkg: string }) {
  const [expanded, setExpanded] = useState(false);

  const curlExample = `curl -X ${rpc.httpMethod} "${GATEWAY_URL}${rpc.httpPath}" \\
  -H "Authorization: Bearer \$TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{}'`;

  const sdkExample = `import { createServiceClient } from '@aicr/service-client';

const client = createServiceClient();
const result = await client.${servicePkg.split('.')[1]}.${rpc.name[0].toLowerCase() + rpc.name.slice(1)}({
  // ${rpc.request} fields
});`;

  return (
    <div className="border-b border-[#1a2a2e] last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-[#0f1a1d] transition-colors"
      >
        <HttpBadge method={rpc.httpMethod} />
        <code className="flex-1 text-sm text-[#ccc]">{rpc.httpPath}</code>
        <span className="text-sm font-medium text-white">{rpc.name}</span>
        <svg
          className={`h-4 w-4 text-[#555] transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="space-y-4 bg-[#0a0e10] px-4 py-4">
          {rpc.description && (
            <p className="text-sm text-[#888]">{rpc.description}</p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#06b6d4]">Request</p>
              <code className="text-sm text-[#ccc]">{rpc.request}</code>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#06b6d4]">Response</p>
              <code className="text-sm text-[#ccc]">{rpc.response}</code>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#06b6d4]">cURL</p>
            <CodeBlock code={curlExample} lang="bash" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#06b6d4]">TypeScript SDK</p>
            <CodeBlock code={sdkExample} lang="typescript" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = manifest.services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-[#888] mb-6">No service with slug &ldquo;{slug}&rdquo;</p>
          <Link href="/" className="text-[#06b6d4] hover:underline">&larr; Back to all demos</Link>
        </div>
      </main>
    );
  }

  const [authToken, setAuthToken] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const rpcs = service.rpcs ?? [];
  const messages = service.messages ?? [];
  const domainMessages = messages.filter(m => !m.name.endsWith('Request') && !m.name.endsWith('Response'));
  const reqResMessages = messages.filter(m => m.name.endsWith('Request') || m.name.endsWith('Response'));

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1a2a2e] bg-[#0d1517]">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-12">
          <Link href="/#api-explorer" className="mb-4 inline-flex items-center gap-1 text-sm text-[#06b6d4] hover:underline">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Services
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{service.name}</h1>
              <p className="mt-1 text-[#888]">{service.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#06b6d4]/10 px-3 py-1 text-sm font-mono text-[#06b6d4]">
                :{service.port}
              </span>
              <span className="rounded-full bg-[#222] px-3 py-1 text-sm text-[#888]">
                {service.category}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-[#888]">
            <span>{rpcs.length} RPCs</span>
            <span>{messages.length} Messages</span>
            <span className="font-mono text-[#555]">{service.package}</span>
            <GatewayHealth />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-12">
        {/* SDK Import */}
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-white">Quick Start</h2>
          <CodeBlock
            code={`import { createServiceClient } from '@aicr/service-client';
const client = createServiceClient();
// All ${service.name} methods available at: client.${service.package.split('.')[1]}.*()`}
            lang="typescript"
          />
        </div>

        {/* Auth Token (for Live mode) */}
        {playgrounds[slug] && (
          <div className="mb-6">
            <button
              onClick={() => setShowAuth(!showAuth)}
              className="flex items-center gap-2 text-xs text-[#555] hover:text-[#888] transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              {showAuth ? 'Hide' : 'Set'} Auth Token (for Live mode)
            </button>
            {showAuth && (
              <div className="mt-2">
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Bearer token for live API calls..."
                  className="w-full rounded-lg border border-[#1a2a2e] bg-[#0a1012] px-3 py-2 font-mono text-sm text-[#ccc] placeholder:text-[#333] focus:border-[#06b6d4]/50 focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-[#444]">Token is stored in memory only, never sent to our servers. Used only for direct gateway calls in Live mode.</p>
              </div>
            )}
          </div>
        )}

        {/* Interactive Playground */}
        {playgrounds[slug] && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">Playground</h2>
              <span className="rounded-full bg-[#06b6d4]/10 px-2.5 py-0.5 text-xs font-medium text-[#06b6d4]">Interactive</span>
            </div>
            <div className="space-y-4">
              {playgrounds[slug].map((pg) => {
                const rpc = rpcs.find(r => r.name === pg.rpcName);
                return (
                  <TryItPanel
                    key={pg.rpcName}
                    method={rpc?.httpMethod ?? 'POST'}
                    path={rpc?.httpPath ?? ''}
                    rpcName={pg.rpcName}
                    defaultBody={pg.defaultBody}
                    description={pg.description}
                    authToken={authToken || undefined}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* RPC Methods */}
        {rpcs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-white">Methods</h2>
            <div className="overflow-hidden rounded-xl border border-[#1a2a2e]">
              {rpcs.map((rpc) => (
                <RpcRow key={rpc.name} rpc={rpc} servicePkg={service.package} />
              ))}
            </div>
          </div>
        )}

        {/* Domain Messages */}
        {domainMessages.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-white">Domain Types</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {domainMessages.map((msg) => (
                <div key={msg.name} className="rounded-lg border border-[#1a2a2e] bg-[#0d1517] p-4">
                  <h3 className="mb-2 font-mono text-sm font-bold text-[#06b6d4]">{msg.name}</h3>
                  {msg.fields?.length > 0 && (
                    <div className="space-y-1">
                      {msg.fields.map((f: { name: string; type: string }) => (
                        <div key={f.name} className="flex justify-between text-xs">
                          <span className="text-[#ccc]">{f.name}</span>
                          <span className="font-mono text-[#555]">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request/Response Messages */}
        {reqResMessages.length > 0 && (
          <details className="mb-8">
            <summary className="mb-3 cursor-pointer text-lg font-bold text-white hover:text-[#06b6d4] transition-colors">
              Request / Response Types ({reqResMessages.length})
            </summary>
            <div className="grid gap-3 sm:grid-cols-2">
              {reqResMessages.map((msg) => (
                <div key={msg.name} className="rounded-lg border border-[#1a2a2e] bg-[#0d1517] p-4">
                  <h3 className="mb-2 font-mono text-sm font-bold text-[#888]">{msg.name}</h3>
                  {msg.fields?.length > 0 && (
                    <div className="space-y-1">
                      {msg.fields.map((f: { name: string; type: string }) => (
                        <div key={f.name} className="flex justify-between text-xs">
                          <span className="text-[#ccc]">{f.name}</span>
                          <span className="font-mono text-[#555]">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </main>
  );
}
