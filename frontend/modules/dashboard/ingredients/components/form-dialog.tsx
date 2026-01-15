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
export const ingredientFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export type IngredientFormSchema = z.infer<typeof ingredientFormSchema>;

type Mode = "create" | "edit";

interface Props {
  open: boolean;
  mode?: Mode;
  defaultValues?: Partial<IngredientFormSchema>;
  isLoadingSubmit?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload: {
      name: string;
    },
    setError: UseFormSetError<IngredientFormSchema>
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

  const form = useForm<IngredientFormSchema>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: resolvedDefaults,
  });

  useEffect(() => {
    if (open) {
      form.reset(resolvedDefaults);
    }
  }, [open, resolvedDefaults, form]);

  const resolvedTitle =
    title ?? (mode === "edit" ? "Edit Ingredient" : "Add New Ingredient");
  const resolvedDescription =
    description ??
    (mode === "edit"
      ? "Update the ingredient by editing the form below."
      : "Create a new ingredient by filling the form below.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save Ingredient");

  const handleSubmit = (values: IngredientFormSchema) => {
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
            id="ingredient-form"
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
                    <Input placeholder="Ingredient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="ingredient-form" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? "Saving..." : resolvedSubmitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
