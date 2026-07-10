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
          "inline-flex shrink-0 items-baseline text-lg font-extrabold leading-none text-charcoal",
          compact && "text-sm",
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
    <div className={cn("flex shrink-0 flex-wrap justify-end gap-x-4 gap-y-1", className)}>
      {entries.map((entry) => (
        <span
          className={cn(
            "inline-flex items-baseline gap-1.5 text-lg font-extrabold leading-none text-charcoal",
            compact && "text-sm",
          )}
          key={entry.key}
        >
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">{priceLabels[entry.key]}</span>
          {formatMenuPrice(entry.value, showPlus)}
        </span>
      ))}
    </div>
  );
}
