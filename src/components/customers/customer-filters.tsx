import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CUSTOMER_STATUSES } from "@/lib/customer-types";
import { cn } from "cn";
import Link from "next/link";

function customersHref(status?: string, query?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/?${search}` : "/";
}

export function CustomerFilters({
  status,
  query,
}: {
  status?: string;
  query?: string;
}) {
  const filters = [
    { value: undefined, label: "All" },
    ...CUSTOMER_STATUSES.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = (status ?? undefined) === filter.value;
          return (
            <Link
              key={filter.label}
              href={customersHref(filter.value, query)}
              className={cn(
                buttonVariants({
                  variant: active ? "default" : "outline",
                  size: "sm",
                }),
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
      <form action="/" className="flex gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search name, phone, or service"
          aria-label="Search customers"
        />
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Search
        </button>
      </form>
    </div>
  );
}
