export default function Alert({ type = 'info', children, className = '', ...props }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div
      className={`border rounded-lg p-4 ${styles[type]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
}
