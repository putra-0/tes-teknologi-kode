"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, ShoppingCart } from "lucide-react";

const summaryIcons = [Users, DollarSign, ShoppingCart];

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {summaryIcons.map((Icon, index) => (
          <Card key={index}>
            <CardHeader className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle>
                <Skeleton className="h-4 w-24 rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-32 rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded" /> {/* tinggi chart */}
        </CardContent>
      </Card>

      {/* Two Tables Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[1, 2].map((_, tableIndex) => (
          <Card key={tableIndex}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-32 rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {["Name", "Date", "Status"].map((header) => (
                      <th key={header} className="p-2 text-left">
                        <Skeleton className="h-4 w-24 rounded" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {Array.from({ length: 3 }).map((_, colIndex) => (
                        <td key={colIndex} className="p-2">
                          <Skeleton className="h-4 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
