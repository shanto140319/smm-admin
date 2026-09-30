import { isCustomerStatus, type Customer } from "@/lib/customer-types";
import { createClient } from "@/lib/supabase/server";

type CustomerRow = Omit<Customer, "paid_amount"> & {
  paid_amount: number | string;
};

export async function listCustomers(status?: string, query?: string) {
  const supabase = await createClient();
  let request = supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && isCustomerStatus(status)) {
    request = request.eq("status", status);
  }

  const safeQuery = query?.replace(/[%_,().\\]/g, "").trim();
  if (safeQuery) {
    request = request.or(
      `name.ilike.%${safeQuery}%,phone.ilike.%${safeQuery}%,social_link.ilike.%${safeQuery}%,interested_service.ilike.%${safeQuery}%`,
    );
  }

  const { data, error } = await request;

  if (error) {
    return { customers: [] as Customer[], error: customerErrorMessage(error.message) };
  }

  const customers = ((data ?? []) as CustomerRow[]).map((customer) => ({
    ...customer,
    paid_amount: Number(customer.paid_amount),
  }));

  return { customers, error: null };
}

export type CustomerStats = {
  purchasedAmount: number;
  purchasedCount: number;
  notPaidCount: number;
};

export async function getCustomerStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("status, paid_amount");

  if (error) {
    return {
      stats: null,
      error: customerErrorMessage(error.message),
    };
  }

  const stats: CustomerStats = {
    purchasedAmount: 0,
    purchasedCount: 0,
    notPaidCount: 0,
  };

  for (const row of data ?? []) {
    if (row.status === "PURCHASED") {
      stats.purchasedCount += 1;
      stats.purchasedAmount += Number(row.paid_amount);
    } else if (row.status === "NOT_PAID") {
      stats.notPaidCount += 1;
    }
  }

  return { stats, error: null };
}

function customerErrorMessage(message: string) {
  if (message.includes("Could not find the table")) {
    return "The customers table is not in Supabase yet. Run supabase/migrations/20260930120000_create_customers.sql in the SQL editor, then refresh.";
  }

  return message;
}
