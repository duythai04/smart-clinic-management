import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "emerald" | "blue" | "orange" | "purple";
}

const colors = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600",
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>

        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="mt-4 text-sm">
        <span className="text-emerald-600 font-semibold">{change}</span>
      </div>
    </div>
  );
}
