

export default function ErrorMessage({ message, className = '' }) {
  if (!message) return null;

  return (
    <p className={`text-red-600 text-sm mt-1 ${className}`} role="alert">
      {message}
    </p>
  );
}