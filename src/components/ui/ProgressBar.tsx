interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max,
  color = "bg-purple-600",
  size = "md",
  showLabel = true,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-purple-100 ${heights[size]} overflow-hidden`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-purple-500 font-medium">
          {value} / {max}
        </p>
      )}
    </div>
  );
}
