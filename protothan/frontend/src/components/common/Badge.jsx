export default function Badge({
  children,
  variant = "info",
  className = "",
}) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
