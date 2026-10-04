import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  message = "There is no information to display here at the moment.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-bubble">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="primary-button" onClick={onAction}>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
