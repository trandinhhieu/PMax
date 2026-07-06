import { formatMenuPrice, type MenuItem, type MenuPriceKey } from "@/data/menu";
import { cn } from "@/lib/utils";

type PriceTagProps = {
  price?: MenuItem["price"];
  prices?: MenuItem["prices"];
  showPlus?: boolean;
  compact?: boolean;
  className?: string;
};

const priceLabels: Record<MenuPriceKey, string> = {
  small: "S",
  medium: "M",
  fivePcs: "5 pcs",
  eightPcs: "8 pcs",
  glass: "Glass",
  pot: "Pot",
};

const priceOrder: MenuPriceKey[] = ["small", "medium", "fivePcs", "eightPcs", "glass", "pot"];

export function PriceTag({ price, prices, showPlus = false, compact = false, className }: PriceTagProps) {
  if (typeof price === "number") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center rounded-lg bg-charcoal px-3 py-1.5 text-sm font-bold text-white",
          compact && "px-2.5 py-1 text-xs",
          className,
        )}
      >
        {formatMenuPrice(price, showPlus)}
      </span>
    );
  }

  const entries = priceOrder
    .map((key) => ({ key, value: prices?.[key] }))
    .filter((entry): entry is { key: MenuPriceKey; value: number } => typeof entry.value === "number");

  if (!entries.length) return null;

  return (
    <div className={cn("flex shrink-0 flex-wrap justify-end gap-2", className)}>
      {entries.map((entry) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-1.5 text-sm font-bold text-white",
            compact && "px-2.5 py-1 text-xs",
          )}
          key={entry.key}
        >
          <span className="text-white/70">{priceLabels[entry.key]}</span>
          {formatMenuPrice(entry.value, showPlus)}
        </span>
      ))}
    </div>
  );
}
