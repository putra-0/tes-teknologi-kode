"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useListCategories } from "@/hooks/lists/use-list-categories";
import { useListIngredients } from "@/hooks/lists/use-list-ingredients";

const ingredientItemSchema = z.object({
  uuid: z.string().min(1, "Ingredient is required"),
  qty: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    },
    z.number().min(0, "Qty must be at least 0").nullable().optional()
  ),
  unit: z.string().min(1, "Unit is required").max(50, "Unit max 50 chars"),
});

export const recipeCreateFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z.string().optional().nullable(),
  ingredients: z.array(ingredientItemSchema).min(1, "At least 1 ingredient"),
});

export const recipeEditFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z.string().optional().nullable(),
});

export type RecipeCreateFormSchema = z.infer<typeof recipeCreateFormSchema>;
export type RecipeEditFormSchema = z.infer<typeof recipeEditFormSchema>;

type Mode = "create" | "edit";

interface Props {
  open: boolean;
  mode?: Mode;
  defaultValues?: Partial<RecipeCreateFormSchema & RecipeEditFormSchema>;
  isLoadingSubmit?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload:
      | {
          category: string;
          name: string;
          description?: string | null;
          ingredients: {
            uuid: string;
            qty?: number | null;
            unit: string;
          }[];
        }
      | {
          name: string;
          description?: string | null;
        },
    setError: UseFormSetError<any>
  ) => void;
}

export function FormDialog({
  open,
  mode = "create",
  defaultValues,
  isLoadingSubmit,
  onOpenChange,
  onSubmit,
}: Props) {
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useListCategories();
  const { data: ingredientsData, isLoading: isLoadingIngredients } =
    useListIngredients();

  const categories = categoriesData?.items ?? [];
  const ingredients = ingredientsData?.items ?? [];

  const resolvedDefaults = useMemo(() => {
    const dv: any = defaultValues ?? {};
    return {
      category: dv.category ?? "",
      name: dv.name ?? "",
      description: (dv.description as string | null | undefined) ?? "",
      ingredients: dv.ingredients ?? [],
    };
  }, [
    defaultValues?.category,
    defaultValues?.name,
    defaultValues?.description,
    // if ingredients defaults are ever added later, this keeps reset behavior stable
    (defaultValues as any)?.ingredients?.length,
  ]);

  const form = useForm<RecipeCreateFormSchema & RecipeEditFormSchema>({
    resolver: zodResolver(mode === "create" ? recipeCreateFormSchema : recipeEditFormSchema),
    defaultValues: resolvedDefaults,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const defaultsSignature = useMemo(() => {
    // Keep this stable across renders even if `defaultValues` is a new object.
    // Only used to decide when to reset the form.
    const dv: any = defaultValues ?? {};
    const ingredientUuids = Array.isArray(dv.ingredients)
      ? dv.ingredients.map((i: any) => i?.uuid).join(",")
      : "";
    return [mode, dv.category ?? "", dv.name ?? "", dv.description ?? "", ingredientUuids].join("|");
  }, [
    mode,
    defaultValues?.category,
    defaultValues?.name,
    defaultValues?.description,
    (defaultValues as any)?.ingredients?.length,
  ]);

  const lastDefaultsSignatureRef = useRef<string>("");
  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    // Avoid wiping user input on every re-render while dialog is open.
    // Only reset when: dialog just opened OR the incoming defaults actually changed.
    const justOpened = open && !wasOpenRef.current;
    const defaultsChanged = lastDefaultsSignatureRef.current !== defaultsSignature;

    if (open && (justOpened || defaultsChanged)) {
      form.reset(resolvedDefaults);
      lastDefaultsSignatureRef.current = defaultsSignature;
    }

    if (!open) {
      lastDefaultsSignatureRef.current = defaultsSignature;
    }

    wasOpenRef.current = open;
  }, [open, defaultsSignature, resolvedDefaults, form]);

  const [ingredientToAdd, setIngredientToAdd] = useState<string>("");

  const availableIngredients = useMemo(() => {
    const selected = new Set(fields.map((f) => f.uuid));
    return ingredients.filter((i) => !selected.has(i.uuid));
  }, [ingredients, fields]);

  const resolvedTitle = mode === "edit" ? "Edit Recipe" : "Add New Recipe";
  const resolvedDescription =
    mode === "edit"
      ? "Update the recipe by editing the form below."
      : "Create a new recipe by filling the form below.";

  const handleAddIngredient = (uuid: string) => {
    if (!uuid) return;

    const exists = fields.some((f) => f.uuid === uuid);
    if (exists) {
      setIngredientToAdd("");
      return;
    }

    append({ uuid, qty: undefined, unit: "" } as any);
    setIngredientToAdd("");
  };

  const handleSubmit = (values: any) => {
    if (mode === "create") {
      onSubmit(
        {
          category: values.category,
          name: values.name,
          description: values.description ? values.description : null,
          ingredients: (values.ingredients ?? []).map((i: any) => ({
            uuid: i.uuid,
            qty: i.qty ?? null,
            unit: i.unit,
          })),
        },
        form.setError as any
      );
      return;
    }

    onSubmit(
      {
        name: values.name,
        description: values.description ? values.description : null,
      },
      form.setError as any
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1">
          <Form {...form}>
            <form
              id="recipe-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {mode === "create" ? (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingCategories}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue
                              placeholder={
                                isLoadingCategories
                                  ? "Loading categories..."
                                  : "Select category"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.uuid} value={c.uuid}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Recipe name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Recipe description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "create" ? (
                <>
                  <div className="space-y-2">
                    <FormLabel>Ingredients</FormLabel>

                    <Select
                      value={ingredientToAdd}
                      onValueChange={(uuid) => {
                        setIngredientToAdd(uuid);
                        handleAddIngredient(uuid);
                      }}
                      disabled={isLoadingIngredients}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue
                          placeholder={
                            isLoadingIngredients
                              ? "Loading ingredients..."
                              : "Add ingredient"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIngredients.length === 0 ? (
                          <SelectItem value="__empty" disabled>
                            No more ingredients
                          </SelectItem>
                        ) : (
                          availableIngredients.map((i) => (
                            <SelectItem key={i.uuid} value={i.uuid}>
                              {i.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    {fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No ingredients selected.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {fields.map((f, index) => {
                          const label =
                            ingredients.find((it) => it.uuid === f.uuid)?.name ??
                            f.uuid;

                          return (
                            <div
                              key={f.id}
                              className="rounded-md border p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-medium">{label}</div>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => remove(index)}
                                >
                                  <X />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name={`ingredients.${index}.qty` as const}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Qty</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          inputMode="decimal"
                                          placeholder="0"
                                          value={(field.value ?? "") as any}
                                          onChange={(e) => {
                                            const v = e.target.value;
                                            field.onChange(v);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`ingredients.${index}.unit` as const}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Unit</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. gram" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <input type="hidden" value={f.uuid} />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {form.formState.errors.ingredients?.message ? (
                      <p className="text-destructive text-sm">
                        {String(form.formState.errors.ingredients.message)}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : null}
            </form>
          </Form>
        </div>

        <DialogFooter className="shrink-0 pt-4">
          <Button type="submit" form="recipe-form" disabled={isLoadingSubmit}>
            {isLoadingSubmit
              ? mode === "edit"
                ? "Saving..."
                : "Creating..."
              : mode === "edit"
              ? "Save Changes"
              : "Save Recipe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
