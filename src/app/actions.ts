"use server";

import { revalidatePath } from "next/cache";
import { isCustomerStatus, type CustomerStatus } from "@/lib/customer-types";
import { createClient } from "@/lib/supabase/server";

export type CustomerFormState = {
  error?: string;
  success?: boolean;
};

type CustomerInput = {
  name: string;
  phone: string;
  social_link: string | null;
  status: CustomerStatus;
  interested_service: string | null;
  paid_amount: number;
  notes: string | null;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseCustomer(
  formData: FormData,
): { error: string } | { value: CustomerInput } {
  const name = readText(formData, "name");
  const phone = readText(formData, "phone");
  const socialLink = readText(formData, "social_link");
  const status = readText(formData, "status");
  const interestedService = readText(formData, "interested_service");
  const notes = readText(formData, "notes");
  const paidAmountInput = readText(formData, "paid_amount");

  if (!name) {
    return { error: "Name is required." };
  }

  if (!phone) {
    return { error: "Phone is required." };
  }

  if (!isCustomerStatus(status)) {
    return { error: "Choose a status." };
  }

  const paidAmount = paidAmountInput === "" ? 0 : Number(paidAmountInput);
  if (!Number.isFinite(paidAmount) || paidAmount < 0) {
    return { error: "Paid amount must be zero or greater." };
  }

  return {
    value: {
      name,
      phone,
      social_link: socialLink || null,
      status,
      interested_service: interestedService || null,
      paid_amount: paidAmount,
      notes: notes || null,
    },
  };
}

function actionError(message: string) {
  if (message.includes("Could not find the table")) {
    return "The customers table is not in Supabase yet. Run supabase/migrations/20260930120000_create_customers.sql in the SQL editor, then try again.";
  }

  if (
    message.toLowerCase().includes("row-level security") ||
    message.toLowerCase().includes("permission denied")
  ) {
    return "Supabase blocked this change. Run supabase/migrations/20260930121000_customer_update_delete.sql in the SQL editor, then try again.";
  }

  return message;
}

export async function createCustomer(
  _previous: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const parsed = parseCustomer(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("customers").insert(parsed.value);

  if (error) {
    return { error: actionError(error.message) };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateCustomer(
  _previous: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const id = readText(formData, "id");
  if (!id) {
    return { error: "Missing customer." };
  }

  const parsed = parseCustomer(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .update(parsed.value)
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: actionError(error.message) };
  }

  if (!data?.length) {
    return {
      error:
        "That customer could not be updated. Run supabase/migrations/20260930121000_customer_update_delete.sql in the SQL editor, then try again.",
    };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteCustomer(
  _previous: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const id = readText(formData, "id");
  if (!id) {
    return { error: "Missing customer." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: actionError(error.message) };
  }

  if (!data?.length) {
    return {
      error:
        "That customer could not be deleted. Run supabase/migrations/20260930121000_customer_update_delete.sql in the SQL editor, then try again.",
    };
  }

  revalidatePath("/");
  return { success: true };
}
