export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`bg-primary-100 rounded-lg shadow-lg shadow-primary-200/50 ${
        padding ? 'p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
