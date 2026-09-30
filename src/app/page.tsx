import { CustomerFilters } from "@/components/customers/customer-filters";
import { AddCustomerButton } from "@/components/customers/customer-form";
import { CustomerStatsCards } from "@/components/customers/customer-stats";
import { CustomerTable } from "@/components/customers/customer-table";
import { isCustomerStatus } from "@/lib/customer-types";
import { getCustomerStats, listCustomers } from "@/lib/customers";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const query = typeof params.q === "string" ? params.q : undefined;
  const activeStatus = status && isCustomerStatus(status) ? status : undefined;
  const [{ customers, error }, { stats, error: statsError }] =
    await Promise.all([
      listCustomers(activeStatus, query),
      getCustomerStats(),
    ]);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1920px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Filter the list by status or search.
          </p>
        </div>
        <AddCustomerButton />
      </header>
      {statsError ? (
        <p role="alert" className="text-sm text-destructive">
          {statsError}
        </p>
      ) : stats ? (
        <CustomerStatsCards stats={stats} />
      ) : null}
      <section className="flex min-w-0 flex-col gap-4">
        <CustomerFilters status={activeStatus} query={query} />
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : (
          <CustomerTable
            customers={customers}
            filtered={Boolean(activeStatus || query)}
          />
        )}
      </section>
    </main>
  );
}
