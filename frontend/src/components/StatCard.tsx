import { useCountUp } from "../hooks/useCountUp";
import type { StatCardProps } from "../types";

const getTextColor = (variant: string) => {
  switch (variant) {
    case "warning":
      return "text-amber-400";
      break;
    case "danger":
      return "text-red-400";
      break;
    case "success":
      return "text-green-400";
      break;
    default:
      return "text-indigo-400";
      break;
  }
};

const getCardColor = (variant: string) => {
  switch (variant) {
    case "warning":
      return "bg-amber-950/30 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm";
      break;
    case "danger":
      return "bg-red-950/30 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm";
      break;
    case "success":
      return "bg-green-950/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm";
      break;
    default:
      return "bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm";
      break;
  }
};

const StatCard = ({
  title,
  value,
  prefix = "",
  subtitle,
  variant = "default",
}: StatCardProps) => {
  const animatedValue = useCountUp(value);
  const textColor = getTextColor(variant);
  const cardColor = getCardColor(variant);

  return (
    <div className={cardColor}>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className={`text-3xl font-bold tracking-tight mt-2 ${textColor}`}>
        {prefix}
        {animatedValue}
      </p>
      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
};

export default StatCard;
