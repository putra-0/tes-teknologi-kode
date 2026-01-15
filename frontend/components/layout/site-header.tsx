"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme/mode-toggle";

export function SiteHeader() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment
      .replace(/-/g, " ")
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
    const isLast = index === pathSegments.length - 1;
    return { href, label, isLast, index, segment };
  });

  const isClickable = (item: (typeof breadcrumbs)[0]) => {
    if (item.index === 0 && item.segment.toLowerCase() === "settings")
      return false;
    if (item.isLast) return false;
    return true;
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem className="hidden md:block">
                  {isClickable(item) ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : item.isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <span className="cursor-default text-gray-400">
                      {item.label}
                    </span>
                  )}
                </BreadcrumbItem>
                {!item.isLast && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
