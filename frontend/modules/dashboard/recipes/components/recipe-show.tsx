"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDate } from "@/lib/format";

import { useRecipe } from "../hooks/use-recipe";

export function RecipeShow({ uuid }: { uuid: string }) {
  const { data, isLoading, isError } = useRecipe(uuid);

  if (isLoading || (!data && !isError)) {
    return (
      <div className="container mx-auto mt-3 min-w-full space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-56 w-full md:col-span-2" />
          <Skeleton className="h-56 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto mt-3 min-w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="page-header">Recipe Details</h2>
          <Button asChild variant="outline">
            <Link href="/recipes">Back</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Failed to load recipe</CardTitle>
            <CardDescription>
              Please refresh the page or go back to the recipes list.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const ingredients = (data.ingredients ?? []).slice().sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "")
  );

  const formatQty = (qty: number | null, unit: string | null) => {
    if (qty === null) return unit ?? "-";
    if (!unit) return String(qty);
    return `${qty} ${unit}`;
  };

  return (
    <div className="container mx-auto mt-3 min-w-full space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="page-header">{data.name}</h2>
            <Badge variant="secondary">{data.category?.name ?? "-"}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Created: {formatDate(data.createdAt)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/recipes">Back</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>About this recipe</CardDescription>
            </CardHeader>
            <CardContent>
              {data.description ? (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {data.description}
                </p>
              ) : (
                <p className="text-muted-foreground">No description yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                What you need to cook {data.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ingredients.length === 0 ? (
                <p className="text-muted-foreground">No ingredients yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Ingredient</TableHead>
                      <TableHead className="w-40">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((item, idx) => (
                      <TableRow key={item.uuid}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{formatQty(item.qty, item.unit)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Quick info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="text-sm font-medium">{data.category?.name ?? "-"}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">Ingredients</div>
              <div className="text-sm font-medium">{ingredients.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
