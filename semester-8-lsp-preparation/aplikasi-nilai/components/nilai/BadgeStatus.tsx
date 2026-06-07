import { Badge } from "@/components/ui/badge";
import { getVarianBadgeStatus } from "@/lib/utils/nilaiUtils";
import { cn } from "@/lib/utils";

type BadgeStatusProps = {
  status: "LULUS" | "TIDAK_LULUS";
  className?: string;
};

export function BadgeStatus({ status, className }: BadgeStatusProps) {
  return (
    <Badge
      variant={getVarianBadgeStatus(status)}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold shadow-sm",
        status === "LULUS"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
          : "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
        className
      )}
    >
      {status === "LULUS" ? "Lulus" : "Tidak Lulus"}
    </Badge>
  );
}
