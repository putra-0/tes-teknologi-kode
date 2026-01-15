"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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

/* =======================
   Schema
======================= */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

type Mode = "create" | "edit";

interface Props {
  open: boolean;
  mode?: Mode;
  defaultValues?: Partial<CategoryFormSchema>;
  isLoadingSubmit?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload: {
      name: string;
    },
    setError: UseFormSetError<CategoryFormSchema>
  ) => void;
}

export function FormDialog({
  open,
  mode = "create",
  defaultValues,
  isLoadingSubmit,
  title,
  description,
  submitLabel,
  onOpenChange,
  onSubmit,
}: Props) {
  const resolvedDefaults = useMemo(
    () => ({
      name: defaultValues?.name ?? "",
    }),
    [defaultValues?.name]
  );

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: resolvedDefaults,
  });

  useEffect(() => {
    if (open) {
      form.reset(resolvedDefaults);
    }
  }, [open, resolvedDefaults, form]);

  const resolvedTitle =
    title ?? (mode === "edit" ? "Edit Category" : "Add New Category");
  const resolvedDescription =
    description ??
    (mode === "edit"
      ? "Update the category by editing the form below."
      : "Create a new category by filling the form below.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save Category");

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
        if (!state) form.reset(resolvedDefaults);
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
          <Button type="submit" form="category-form" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? "Saving..." : resolvedSubmitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
