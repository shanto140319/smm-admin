"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createCustomer,
  updateCustomer,
  type CustomerFormState,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CUSTOMER_STATUSES, type Customer } from "@/lib/customer-types";

const initialState: CustomerFormState = {};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function CustomerFormFields({
  customer,
  onSaved,
}: {
  customer?: Customer;
  onSaved: () => void;
}) {
  const action = customer ? updateCustomer : createCustomer;
  const [state, formAction, pending] = useActionState(action, initialState);
  const idPrefix = customer?.id ?? "new";

  useEffect(() => {
    if (state.success) {
      onSaved();
    }
  }, [state, onSaved]);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      {customer ? <input type="hidden" name="id" value={customer.id} /> : null}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-name`}>Name</Label>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            required
            autoComplete="name"
            defaultValue={customer?.name ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-phone`}>Phone</Label>
          <Input
            id={`${idPrefix}-phone`}
            name="phone"
            required
            autoComplete="tel"
            defaultValue={customer?.phone ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-social`}>Social link</Label>
          <Input
            id={`${idPrefix}-social`}
            name="social_link"
            placeholder="https://"
            defaultValue={customer?.social_link ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            name="status"
            defaultValue={customer?.status ?? "INTERESTED"}
            className={selectClassName}
          >
            {CUSTOMER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-service`}>Interested service</Label>
          <Input
            id={`${idPrefix}-service`}
            name="interested_service"
            defaultValue={customer?.interested_service ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-paid`}>Paid amount</Label>
          <Input
            id={`${idPrefix}-paid`}
            name="paid_amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            defaultValue={customer ? customer.paid_amount : ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-notes`}>Notes</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            name="notes"
            defaultValue={customer?.notes ?? ""}
          />
        </div>
      </div>
      <div className="shrink-0 border-t bg-popover px-4 py-4">
        {state.error ? (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

export function CustomerFormDialog({
  customer,
  triggerLabel,
  triggerVariant = "default",
  triggerSize = "default",
}: {
  customer?: Customer;
  triggerLabel: string;
  triggerVariant?: "default" | "outline";
  triggerSize?: "default" | "sm";
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setFormKey((key) => key + 1);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" variant={triggerVariant} size={triggerSize} />
        }
      >
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-4 pt-4 pr-12">
          <DialogTitle>
            {customer ? "Update customer" : "Add customer"}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? `Changes replace the current details for ${customer.name}.`
              : "New customers show up in the list right away."}
          </DialogDescription>
        </DialogHeader>
        <CustomerFormFields
          key={formKey}
          customer={customer}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function AddCustomerButton() {
  return <CustomerFormDialog triggerLabel="Add customer" />;
}
