export default function EmptyState({
  title,
  message,
  action,
  icon,
  className = '',
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-xl font-semibold text-secondary-200 mb-2">{title}</h3>
      {message && <p className="text-secondary-200 mb-6">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
