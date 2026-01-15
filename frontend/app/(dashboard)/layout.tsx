"use client";

import React, { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { useAuthStore } from "@/store/auth-store";
import { getProfile } from "@/services/get-profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await getProfile();
        useAuthStore.setState({ user: data });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar variant="floating" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
