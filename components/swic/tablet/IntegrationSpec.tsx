'use client';

import { Printer } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   IntegrationSpec — Printable D365 Commerce integration spec
   5 sections: Architecture, Event Contract, Required Fields,
   Response Contract, Integration Steps
   ══════════════════════════════════════════════════════════════ */

export function IntegrationSpec() {
  return (
    <div className="min-h-screen mesh-bg-dark print:bg-white">
      {/* ── Print Button (hidden when printing) ──────────────── */}
      <button
        onClick={() => window.print()}
        className="fixed top-4 right-4 z-50 print:hidden glass-pill px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        style={{ color: 'var(--page-text)' }}
      >
        <Printer className="w-4 h-4" />
        Print
      </button>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="max-w-[900px] mx-auto px-6 py-10 print:px-0 print:py-0 print:max-w-none">
        {/* Header */}
        <header className="mb-10 print:mb-6">
          <h1
            className="text-3xl font-black tracking-tight print:text-black"
            style={{ color: 'var(--page-text)' }}
          >
            SWIC Integration Specification
          </h1>
          <p
            className="text-lg mt-1 print:text-gray-600"
            style={{ color: 'var(--page-muted)' }}
          >
            D365 Commerce &mdash; Real-Time Compensation Calculator
          </p>
          <div
            className="mt-3 h-px w-full"
            style={{ background: 'var(--glass-border)' }}
          />
        </header>

        {/* ── Section 1: Architecture ──────────────────────────── */}
        <Section number={1} title="Architecture">
          <div className="overflow-x-auto">
            <div className="flex items-start gap-0 min-w-[600px] py-4 print:py-2">
              {/* Row 1: D365 POS -> ASB -> SWIC Engine -> POS Widget */}
              <div className="flex items-center">
                <ArchNode label="D365 POS" />
                <ArchArrow />
                <ArchNode label="Azure Service Bus" />
                <ArchArrow />
                <ArchNode label="SWIC Engine" />
                <ArchArrow />
                <ArchNode label="POS Widget" />
              </div>
            </div>

            {/* Branch: SWIC Engine -> Audit Copy -> D365 */}
            <div className="min-w-[600px]" style={{ paddingLeft: 'calc(50% - 12px)' }}>
              <div className="flex flex-col items-center">
                <div
                  className="w-px h-5 print:bg-gray-400"
                  style={{ background: 'var(--glass-border)' }}
                />
                <ArchArrowDown />
                <ArchNode label="Audit Copy" sub="&rarr; D365" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Section 2: Event Contract ────────────────────────── */}
        <Section number={2} title="Event Contract">
          <SpecTable
            headers={['Field', 'Value']}
            rows={[
              ['Business Event', <Mono key="be">RetailTransactionPostedBusinessEvent</Mono>],
              ['Delivery', 'Azure Service Bus Topic'],
              ['Format', 'JSON (base64-encoded in message body)'],
              ['Idempotency', <><Mono key="idem">ControlNumber</Mono> field (auto-incrementing)</>],
              [
                'Filtering',
                <><Mono key="f1">BusinessEventId</Mono>, <Mono key="f2">Category</Mono>, <Mono key="f3">LegalEntity</Mono> message properties</>,
              ],
            ]}
          />
        </Section>

        {/* ── Section 3: Required Fields ───────────────────────── */}
        <Section number={3} title="Required Fields">
          {/* Transaction Header */}
          <SubSection title="Transaction Header">
            <SpecTable
              headers={['Field', 'Type', 'Purpose']}
              rows={[
                [<Mono key="f1">transactionId</Mono>, 'string', 'POS-generated ID (store + terminal + seq)'],
                [<Mono key="f2">receiptId</Mono>, 'string', 'Printed receipt number'],
                [<Mono key="f3">store</Mono>, 'string', 'Store ID'],
                [<Mono key="f4">terminal</Mono>, 'string', 'Terminal/Register ID'],
                [<Mono key="f5">staffId</Mono>, 'string', 'Operator/associate ID'],
                [<Mono key="f6">transDate</Mono>, 'date', 'Transaction date'],
                [<Mono key="f7">grossAmount</Mono>, 'decimal', 'Total before discounts'],
                [<Mono key="f8">totalDiscAmount</Mono>, 'decimal', 'All discounts'],
                [<Mono key="f9">taxAmount</Mono>, 'decimal', 'Total tax'],
                [<Mono key="f10">paymentAmount</Mono>, 'decimal', 'Amount tendered'],
              ]}
            />
          </SubSection>

          {/* Sales Line */}
          <SubSection title="Sales Line">
            <SpecTable
              headers={['Field', 'Type', 'Purpose']}
              rows={[
                [<Mono key="s1">lineNum</Mono>, 'decimal', 'Line number'],
                [<Mono key="s2">itemId</Mono>, 'string', 'SKU'],
                [<Mono key="s3">description</Mono>, 'string', 'Product name'],
                [<Mono key="s4">qty</Mono>, 'decimal', 'Quantity'],
                [<Mono key="s5">price</Mono>, 'decimal', 'Unit price'],
                [<Mono key="s6">netAmount</Mono>, 'decimal', 'Line total after discount'],
                [<Mono key="s7">discAmount</Mono>, 'decimal', 'Total line discount'],
                [<Mono key="s8">taxAmount</Mono>, 'decimal', 'Line tax'],
                [<Mono key="s9">staffId</Mono>, 'string', 'Per-line associate (split credit)'],
                [<Mono key="s10">costAmount</Mono>, 'decimal', 'Cost (margin calc)'],
              ]}
            />
          </SubSection>

          {/* Tender Line */}
          <SubSection title="Tender Line">
            <SpecTable
              headers={['Field', 'Type', 'Purpose']}
              rows={[
                [<Mono key="t1">tenderTypeId</Mono>, 'string', '1=Cash, 2=Card, 3=Check'],
                [<Mono key="t2">amount</Mono>, 'decimal', 'Payment amount'],
                [<Mono key="t3">cardTypeId</Mono>, 'string', 'Visa, MasterCard, etc.'],
                [<Mono key="t4">authorization</Mono>, 'string', 'Auth code'],
              ]}
            />
          </SubSection>
        </Section>

        {/* ── Section 4: Response Contract ─────────────────────── */}
        <Section number={4} title="Response Contract">
          <p
            className="text-sm mb-3 print:text-gray-600"
            style={{ color: 'var(--page-muted)' }}
          >
            The SWIC engine returns a compensation breakdown for every processed transaction:
          </p>
          <CodeBlock
            code={`{
  "components": [
    { "id": "base-comm", "label": "Base Comm.", "amount": 180.00 },
    { "id": "bundle-accel", "label": "Bundle Accel.", "amount": 75.00 }
  ],
  "total": 330.00,
  "tierProgress": {
    "current": "Tier 3 (5%)",
    "next": "Tier 4 (6%)",
    "amountNeeded": 3200.00
  }
}`}
          />
        </Section>

        {/* ── Section 5: Integration Steps ─────────────────────── */}
        <Section number={5} title="Integration Steps">
          <ol className="space-y-3">
            {INTEGRATION_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold print:border print:border-gray-300 print:bg-gray-50"
                  style={{
                    background: 'var(--glass-bg-strong)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--page-text)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-sm leading-relaxed pt-1 print:text-black"
                  style={{ color: 'var(--page-text)' }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer
          className="mt-12 pt-4 text-center text-xs print:mt-8 print:text-gray-400"
          style={{
            borderTop: '1px solid var(--glass-border)',
            color: 'var(--page-muted)',
          }}
        >
          SWIC by AI Code Rally &nbsp;|&nbsp; demo.swic-summit.aicoderally.com
        </footer>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════ */

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 print:mb-6 print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black print:border print:border-gray-300 print:bg-gray-100 print:text-black"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
          }}
        >
          {number}
        </span>
        <h2
          className="text-xl font-bold tracking-tight print:text-black"
          style={{ color: 'var(--page-text)' }}
        >
          {title}
        </h2>
      </div>
      <div
        className="glass rounded-2xl p-5 print:bg-white print:border print:border-gray-200 print:shadow-none"
        style={{ backdropFilter: 'var(--glass-blur)' }}
      >
        {children}
      </div>
    </section>
  );
}

/* ── Sub-section header ──────────────────────────────────────── */
function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <h3
        className="text-sm font-bold mb-2 print:text-black"
        style={{ color: 'var(--page-text)' }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ── Spec Table ──────────────────────────────────────────────── */
function SpecTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b print:border-gray-300 print:text-gray-500"
                style={{
                  color: 'var(--page-muted)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b last:border-b-0 print:border-gray-200"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 print:text-black"
                  style={{ color: 'var(--page-text)' }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Mono inline code ────────────────────────────────────────── */
function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="font-mono text-xs px-1.5 py-0.5 rounded print:bg-gray-100 print:text-black"
      style={{
        background: 'var(--glass-bg-strong)',
        color: 'var(--page-text)',
      }}
    >
      {children}
    </code>
  );
}

/* ── Code Block ──────────────────────────────────────────────── */
function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="overflow-x-auto rounded-xl p-4 text-xs leading-relaxed font-mono print:bg-gray-50 print:border print:border-gray-200 print:text-black"
      style={{
        background: 'var(--glass-bg-strong)',
        border: '1px solid var(--glass-border)',
        color: 'var(--page-text)',
      }}
    >
      <code>{highlightJson(code)}</code>
    </pre>
  );
}

/* ── JSON syntax highlighting (minimal, CSS-only colors) ─────── */
function highlightJson(code: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let idx = 0;

  const regex =
    /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(true|false|null)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code)) !== null) {
    // Text before match
    if (match.index > idx) {
      parts.push(code.slice(idx, match.index));
    }

    if (match[1]) {
      // Key
      parts.push(
        <span key={`k-${match.index}`} className="print:text-gray-700" style={{ color: '#93c5fd' }}>
          {match[1]}
        </span>,
      );
      parts.push(':');
    } else if (match[2]) {
      // String value
      parts.push(
        <span key={`s-${match.index}`} className="print:text-green-700" style={{ color: '#86efac' }}>
          {match[2]}
        </span>,
      );
    } else if (match[3]) {
      // Number
      parts.push(
        <span key={`n-${match.index}`} className="print:text-blue-700" style={{ color: '#fbbf24' }}>
          {match[3]}
        </span>,
      );
    } else if (match[4]) {
      // Boolean/null
      parts.push(
        <span key={`b-${match.index}`} className="print:text-purple-700" style={{ color: '#c4b5fd' }}>
          {match[4]}
        </span>,
      );
    }

    idx = match.index + match[0].length;
  }

  // Remaining text
  if (idx < code.length) {
    parts.push(code.slice(idx));
  }

  return parts;
}

/* ── Architecture Diagram Sub-components ─────────────────────── */
function ArchNode({ label, sub }: { label: string; sub?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-3 rounded-xl text-xs font-semibold min-w-[7rem] text-center print:bg-gray-50 print:border-gray-300"
      style={{
        background: 'var(--glass-bg-strong)',
        border: '1px solid var(--glass-border)',
        color: 'var(--page-text)',
        backdropFilter: 'var(--glass-blur)',
      }}
    >
      <span>{label}</span>
      {sub && (
        <span
          className="text-[10px] mt-0.5 print:text-gray-500"
          style={{ color: 'var(--page-muted)' }}
          dangerouslySetInnerHTML={{ __html: sub }}
        />
      )}
    </div>
  );
}

function ArchArrow() {
  return (
    <div className="flex items-center mx-1.5">
      <div
        className="w-8 h-px print:bg-gray-400"
        style={{ background: 'var(--glass-border)' }}
      />
      <div
        className="w-0 h-0"
        style={{
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: '6px solid var(--glass-border)',
        }}
      />
    </div>
  );
}

function ArchArrowDown() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-0 h-0"
        style={{
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '6px solid var(--glass-border)',
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Static Data
   ══════════════════════════════════════════════════════════════ */

const INTEGRATION_STEPS = [
  'Enable Business Events in D365 Finance & Operations',
  'Create Azure Service Bus topic + subscription',
  'Configure SWIC endpoint as event subscriber',
  'Map compensation plan rules to SWIC ClientConfig',
  'Embed SWIC widget in POS via <iframe> + PostMessage API',
];
