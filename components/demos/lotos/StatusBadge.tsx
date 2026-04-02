interface StatusBadgeProps {
  label: string;
  color: string;
  onClick?: () => void;
}

export function StatusBadge({ label, color, onClick }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold${onClick ? ' cursor-pointer hover:opacity-80' : ''}`}
      style={{ backgroundColor: `${color}18`, color }}
      onClick={onClick}
    >
      {label}
    </span>
  );
}
