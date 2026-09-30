"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteCustomer, type CustomerFormState } from "@/app/actions";
import { CustomerFormDialog } from "@/components/customers/customer-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Customer } from "@/lib/customer-types";

const initialState: CustomerFormState = {};

function DeleteSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

function DeleteCustomerDialog({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteCustomer, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="destructive" size="sm" type="button" />}
      >
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {customer.name}?</DialogTitle>
          <DialogDescription>
            This removes the customer from the list.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={customer.id} />
          {state.error ? (
            <p role="alert" className="mb-4 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <DialogFooter>
            <DeleteSubmit />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CustomerRowActions({ customer }: { customer: Customer }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <CustomerFormDialog
        customer={customer}
        triggerLabel="Update"
        triggerVariant="outline"
        triggerSize="sm"
      />
      <DeleteCustomerDialog customer={customer} />
    </div>
  );
}
