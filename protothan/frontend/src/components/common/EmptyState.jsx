import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "No Data Found",
  description = "There are currently no items available to display.",
  icon: Icon = Inbox,
  actionText,
  onAction,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-3xl bg-white/[0.01] ${className}`}>
      <div className="p-4 rounded-full bg-slate-900/60 border border-white/5 text-slate-500 mb-4">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-white font-display mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
