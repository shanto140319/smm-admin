import { CustomerRowActions } from "@/components/customers/customer-row-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  statusLabel,
  type Customer,
  type CustomerStatus,
} from "@/lib/customer-types";

const statusClassName: Record<CustomerStatus, string> = {
  PURCHASED:
    "border-transparent bg-green-600 text-white dark:bg-green-500 dark:text-green-950",
  INTERESTED:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  FOLLOW_UP:
    "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200",
  NOT_PAID:
    "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  NOT_INTERESTED: "",
};

const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const amountFormat = new Intl.NumberFormat("en", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}

function SocialLink({ href }: { href: string | null }) {
  if (!href) return "—";
  const url = /^https?:\/\//i.test(href) ? href : undefined;
  if (!url) return href;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-4"
    >
      {href}
    </a>
  );
}

export function CustomerTable({
  customers,
  filtered,
}: {
  customers: Customer[];
  filtered: boolean;
}) {
  if (customers.length === 0) {
    return (
      <p className="rounded-xl bg-card px-4 py-10 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
        {filtered
          ? "No customers match this filter."
          : "No customers yet."}
      </p>
    );
  }

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Social link</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interested service</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <a href={`tel:${customer.phone}`} className="underline-offset-4 hover:underline">
                  {customer.phone}
                </a>
              </TableCell>
              <TableCell className="max-w-48 truncate">
                <SocialLink href={customer.social_link} />
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    customer.status === "NOT_INTERESTED"
                      ? "destructive"
                      : "outline"
                  }
                  className={statusClassName[customer.status]}
                >
                  {statusLabel(customer.status)}
                </Badge>
              </TableCell>
              <TableCell>{customer.interested_service || "—"}</TableCell>
              <TableCell className="text-right tabular-nums">
                {amountFormat.format(customer.paid_amount)}
              </TableCell>
              <TableCell className="max-w-56 whitespace-normal">
                {customer.notes || "—"}
              </TableCell>
              <TableCell>{formatDate(customer.created_at)}</TableCell>
              <TableCell>{formatDate(customer.updated_at)}</TableCell>
              <TableCell>
                <CustomerRowActions customer={customer} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
