import { motion } from "framer-motion";

export default function Input({
  label,
  error,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required = false,
  className = "",
  icon: Icon,
  disabled = false,
  register = {}, // hook-form registry
}) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          className={`
            w-full
            py-3.5
            ${Icon ? "pl-11" : "pl-4"}
            pr-4
            text-sm
            bg-[#0b1329]/55
            backdrop-blur-md
            border
            ${error ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20" : "border-white/10 focus:border-emerald-500/40 focus:ring-emerald-500/10"}
            rounded-xl
            text-white
            placeholder-slate-500
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            disabled:opacity-40
            disabled:cursor-not-allowed
          `}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 font-mono mt-0.5"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
