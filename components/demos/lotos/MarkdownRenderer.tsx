interface MarkdownRendererProps {
  text: string;
}

function renderInline(text: string): (string | React.JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--lot-text)' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  const lines = text.split('\n');
  const elements: React.JSX.Element[] = [];
  let tableLines: string[] = [];
  let listBuffer: { type: 'ol' | 'ul'; items: string[] } | null = null;

  function flushList() {
    if (!listBuffer) return;
    const Tag = listBuffer.type;
    elements.push(
      <Tag key={elements.length} className={`${Tag === 'ol' ? 'list-decimal' : 'list-disc'} ml-5 mt-2 space-y-1`} style={{ color: 'var(--lot-text-secondary)' }}>
        {listBuffer.items.map((item, i) => (
          <li key={i} className="text-sm" style={{ fontSize: '14px' }}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    listBuffer = null;
  }

  function flushTable() {
    if (tableLines.length < 2) return;
    const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
    const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
    elements.push(
      <div key={elements.length} className="overflow-x-auto mt-3">
        <table className="lot-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
  }

  for (const line of lines) {
    if (line.startsWith('|')) {
      flushList();
      tableLines.push(line);
      continue;
    }
    if (tableLines.length > 0) flushTable();

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={elements.length} className="text-lg font-bold mt-4 mb-2 pl-3" style={{ color: 'var(--lot-text)', borderLeft: '3px solid #DC2626' }}>
          {line.slice(3)}
        </h3>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const item = line.replace(/^\d+\.\s/, '');
      if (listBuffer?.type === 'ol') {
        listBuffer.items.push(item);
      } else {
        flushList();
        listBuffer = { type: 'ol', items: [item] };
      }
    } else if (line.startsWith('- ')) {
      const item = line.slice(2);
      if (listBuffer?.type === 'ul') {
        listBuffer.items.push(item);
      } else {
        flushList();
        listBuffer = { type: 'ul', items: [item] };
      }
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={elements.length} className="text-sm mt-2" style={{ color: 'var(--lot-text-secondary)', fontSize: '14px' }}>{renderInline(line)}</p>
      );
    }
  }
  flushList();
  if (tableLines.length > 0) flushTable();

  return <div>{elements}</div>;
}
