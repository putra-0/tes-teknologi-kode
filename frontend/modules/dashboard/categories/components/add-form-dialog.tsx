"use client";

import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import z from "zod";

/* =======================
   Schema
======================= */
export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

interface Props {
  open: boolean;
  isLoadingSubmit?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload: {
      name: string;
    },
    setError: UseFormSetError<CategoryFormSchema>
  ) => void;
}

export function AddFormDialog({
  open,
  isLoadingSubmit,
  onOpenChange,
  onSubmit,
}: Props) {

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  /* =======================
     Submit Handler
  ======================= */
  const handleSubmit = (values: CategoryFormSchema) => {

    onSubmit(
      {
        name: values.name,
      },
      form.setError
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category by filling the form below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form="category-form"
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? "Saving..." : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
