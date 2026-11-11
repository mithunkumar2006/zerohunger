export default function Table({
  headers = [],
  children,
  className = "",
}) {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#0f172a]/20 backdrop-blur-md ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 font-display"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06] text-sm text-slate-200">
          {children}
        </tbody>
      </table>
    </div>
  );
}
