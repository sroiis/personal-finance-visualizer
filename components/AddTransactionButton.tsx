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

interface Props {
  onAdd: () => void;
}

export default function AddTransactionButton({ onAdd }: Props) {
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    onAdd();        
    setOpen(false);  
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" aria-label="Add a new transaction">
          + Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Fill in the details and save your transaction.
          </DialogDescription>
        </DialogHeader>

        <TransactionForm onAdd={handleAdd} />
      </DialogContent>
    </Dialog>
  );
}
