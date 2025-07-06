'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TransactionForm from './TransactionForm';
import { useState } from 'react';

export default function AddTransactionButton({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Fill in the details and save the transaction.
          </DialogDescription>
        </DialogHeader>

        {/* FORM COMPONENT */}
        <TransactionForm
          onAdd={() => {
            onAdd(); // Refresh transaction list
            setOpen(false); // Close dialog after submit
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
