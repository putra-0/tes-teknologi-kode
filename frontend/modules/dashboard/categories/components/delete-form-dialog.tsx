"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category } from "../data/type";

interface Props {
  open: boolean;
  currentRow?: Category | null;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (uuid: string) => void;
}

export function DeleteConfirmDialog({
  open,
  currentRow,
  isLoading,
  onOpenChange,
  onConfirm,
}: Props) {
  if (!currentRow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category?
            <br />
            <span className="font-medium">{currentRow.name}</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => onConfirm(currentRow.uuid)}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
