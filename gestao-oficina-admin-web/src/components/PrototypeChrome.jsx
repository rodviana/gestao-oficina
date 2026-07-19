export function StatusBadge({ label, tone }) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}
