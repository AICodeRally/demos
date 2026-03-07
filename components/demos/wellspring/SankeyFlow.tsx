'use client';

interface SankeyNode {
  id: string;
  label: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

interface SankeyFlowProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
}

export function SankeyFlow({
  nodes,
  links,
  height = 300,
}: SankeyFlowProps) {
  if (nodes.length === 0 || links.length === 0) return null;

  const width = 500;
  const paddingLeft = 16;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 16;
  const nodeWidth = 20;
  const nodePadding = 8;
  const labelPadding = 6;

  // Partition nodes into source (left) and target (right) groups
  const sourceIds = new Set(links.map((l) => l.source));
  const targetIds = new Set(links.map((l) => l.target));

  // Nodes that are only sources go left, only targets go right
  // Nodes that are both go left (they appear as source)
  const leftNodes = nodes.filter(
    (n) => sourceIds.has(n.id) && !targetIds.has(n.id),
  );
  const rightNodes = nodes.filter(
    (n) => targetIds.has(n.id) && !sourceIds.has(n.id),
  );
  // Nodes that are both source and target - put on left
  const bothNodes = nodes.filter(
    (n) => sourceIds.has(n.id) && targetIds.has(n.id),
  );
  const finalLeft = [...leftNodes, ...bothNodes];
  const finalRight = rightNodes.length > 0 ? rightNodes : nodes.filter((n) => !sourceIds.has(n.id));

  // If we still have no right nodes, split nodes in half
  const left = finalLeft.length > 0 ? finalLeft : nodes.slice(0, Math.ceil(nodes.length / 2));
  const right = finalRight.length > 0 ? finalRight : nodes.slice(Math.ceil(nodes.length / 2));

  // Compute total values flowing through each node
  const nodeValues: Record<string, number> = {};
  for (const link of links) {
    nodeValues[link.source] = (nodeValues[link.source] || 0) + link.value;
    nodeValues[link.target] = (nodeValues[link.target] || 0) + link.value;
  }

  const chartHeight = height - paddingTop - paddingBottom;

  // Layout left nodes
  function layoutColumn(
    columnNodes: SankeyNode[],
    x: number,
  ): Record<string, { x: number; y: number; h: number }> {
    const totalValue = columnNodes.reduce(
      (sum, n) => sum + (nodeValues[n.id] || 1),
      0,
    );
    const availableHeight =
      chartHeight - nodePadding * Math.max(0, columnNodes.length - 1);
    const positions: Record<string, { x: number; y: number; h: number }> = {};
    let currentY = paddingTop;

    for (const node of columnNodes) {
      const value = nodeValues[node.id] || 1;
      const h = Math.max((value / totalValue) * availableHeight, 16);
      positions[node.id] = { x, y: currentY, h };
      currentY += h + nodePadding;
    }

    return positions;
  }

  const leftX = paddingLeft;
  const rightX = width - paddingRight - nodeWidth;

  const leftPositions = layoutColumn(left, leftX);
  const rightPositions = layoutColumn(right, rightX);
  const allPositions = { ...leftPositions, ...rightPositions };

  // Track offsets for stacking links at each node
  const sourceOffsets: Record<string, number> = {};
  const targetOffsets: Record<string, number> = {};

  // Sort links by value descending for better visual
  const sortedLinks = [...links].sort((a, b) => b.value - a.value);

  // Compute max link value for width scaling
  const maxLinkValue = Math.max(...links.map((l) => l.value), 1);
  const maxLinkWidth = chartHeight * 0.3;

  function linkWidth(value: number): number {
    return Math.max((value / maxLinkValue) * maxLinkWidth, 2);
  }

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {/* Links (drawn first, behind nodes) */}
      {sortedLinks.map((link, i) => {
        const sourcePos = allPositions[link.source];
        const targetPos = allPositions[link.target];
        if (!sourcePos || !targetPos) return null;

        const w = linkWidth(link.value);
        const sOffset = sourceOffsets[link.source] || 0;
        const tOffset = targetOffsets[link.target] || 0;

        const x0 = sourcePos.x + nodeWidth;
        const y0 = sourcePos.y + sOffset + w / 2;
        const x1 = targetPos.x;
        const y1 = targetPos.y + tOffset + w / 2;

        sourceOffsets[link.source] = sOffset + w;
        targetOffsets[link.target] = tOffset + w;

        const midX = (x0 + x1) / 2;
        const linkColor = link.color || 'rgba(180, 83, 9, 0.30)';

        return (
          <path
            key={`link-${i}`}
            d={`M ${x0} ${y0} C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`}
            fill="none"
            stroke={linkColor}
            strokeWidth={w}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        );
      })}

      {/* Left nodes */}
      {left.map((node) => {
        const pos = leftPositions[node.id];
        if (!pos) return null;

        return (
          <g key={`lnode-${node.id}`}>
            <rect
              x={pos.x}
              y={pos.y}
              width={nodeWidth}
              height={pos.h}
              rx={3}
              fill="#B45309"
            />
            <text
              x={pos.x - labelPadding}
              y={pos.y + pos.h / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#F1F5F9"
              fontSize={11}
              fontWeight={500}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Right nodes */}
      {right.map((node) => {
        const pos = rightPositions[node.id];
        if (!pos) return null;

        return (
          <g key={`rnode-${node.id}`}>
            <rect
              x={pos.x}
              y={pos.y}
              width={nodeWidth}
              height={pos.h}
              rx={3}
              fill="#B45309"
            />
            <text
              x={pos.x + nodeWidth + labelPadding}
              y={pos.y + pos.h / 2}
              textAnchor="start"
              dominantBaseline="middle"
              fill="#F1F5F9"
              fontSize={11}
              fontWeight={500}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
