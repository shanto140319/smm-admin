export const CUSTOMER_STATUSES = [
  { value: "INTERESTED", label: "Interested" },
  { value: "FOLLOW_UP", label: "Follow up" },
  { value: "PURCHASED", label: "Purchased" },
  { value: "NOT_PAID", label: "Not paid" },
  { value: "NOT_INTERESTED", label: "Not interested" },
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]["value"];

export type Customer = {
  id: string;
  name: string;
  phone: string;
  social_link: string | null;
  status: CustomerStatus;
  interested_service: string | null;
  paid_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function isCustomerStatus(value: string): value is CustomerStatus {
  return CUSTOMER_STATUSES.some((status) => status.value === value);
}

export function statusLabel(status: CustomerStatus) {
  return CUSTOMER_STATUSES.find((item) => item.value === status)?.label ?? status;
}
