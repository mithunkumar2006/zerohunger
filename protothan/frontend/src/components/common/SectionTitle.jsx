export default function SectionTitle({
  badge,
  title,
  description,
  center = true,
}) {
  return (
    <div
      className={`mb-20 ${
        center ? "text-center" : ""
      }`}
    >
      {badge && (
        <span className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm tracking-widest uppercase font-semibold">
          {badge}
        </span>
      )}

      <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-3xl mx-auto text-gray-400 text-lg leading-8">
          {description}
        </p>
      )}
    </div>
  );
}