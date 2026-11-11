import { Star, Quote } from "lucide-react";

export default function TestimonialCard({ name, role, review, image, rating = 5 }) {
  return (
    <div className="inline-block w-[360px] md:w-[420px] shrink-0 whitespace-normal rounded-3xl border border-slate-800/80 bg-slate-900/30 p-8 backdrop-blur-xl hover:border-slate-700/50 transition-all duration-300 relative group overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      {/* Quote Icon */}
      <div className="flex items-center justify-between mb-5">
        <Quote size={28} className="text-emerald-500/35 group-hover:text-emerald-500/60 transition-colors duration-300" />
        <div className="flex gap-0.5">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={15} fill="#10b981" color="#10b981" />
          ))}
        </div>
      </div>

      {/* Testimonial text */}
      <p className="text-slate-350 text-sm md:text-base leading-relaxed mb-6 font-medium font-sans">
        "{review}"
      </p>

      {/* Author info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-slate-800 flex items-center justify-center text-2xl select-none group-hover:scale-105 transition-transform">
          {image}
        </div>
        <div>
          <h4 className="text-white font-bold text-sm md:text-base tracking-tight">{name}</h4>
          <p className="text-emerald-400 text-xs font-bold tracking-wide mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  );
}
