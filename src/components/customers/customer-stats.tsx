import type { CustomerStats } from "@/lib/customers";

const amountFormat = new Intl.NumberFormat("en", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const countFormat = new Intl.NumberFormat("en");

export function CustomerStatsCards({ stats }: { stats: CustomerStats }) {
  const items = [
    {
      label: "Purchased amount",
      value: amountFormat.format(stats.purchasedAmount),
      className: "text-green-700 dark:text-green-400",
    },
    {
      label: "Orders",
      value: countFormat.format(stats.purchasedCount),
      className: "text-emerald-700 dark:text-emerald-300",
    },
    {
      label: "Not paid",
      value: countFormat.format(stats.notPaidCount),
      className: "text-orange-700 dark:text-orange-300",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-card px-4 py-4 ring-1 ring-foreground/10"
        >
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${item.className}`}>
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
