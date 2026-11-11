import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Button({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  loading = false,
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)]",
    secondary:
      "bg-[#0f172a]/80 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    outline:
      "border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-[0_12px_30px_rgba(239,68,68,0.35)]",
    glass:
      "bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20",
    accent:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-[0_12px_30px_rgba(168,85,247,0.35)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  const baseClasses = `
    inline-flex
    items-center
    justify-center
    gap-2
    font-semibold
    transition-all
    duration-300
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:transform-none
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  const motionProps = {
    whileHover: disabled || loading ? {} : { y: -2, scale: 1.02 },
    whileTap: disabled || loading ? {} : { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 15 },
  };

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className="contents">
        <motion.span {...motionProps} className={`${baseClasses} cursor-pointer`}>
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}