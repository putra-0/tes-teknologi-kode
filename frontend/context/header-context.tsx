"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface BreadcrumbItem {
  href: string;
  label: string;
  active?: boolean;
}

interface HeaderContextProps {
  title: string | null;
  setTitle: (title: string | null) => void;
  breadcrumbs: BreadcrumbItem[] | null;
  setBreadcrumbs: (items: BreadcrumbItem[] | null) => void;
  actions: ReactNode | null;
  setActions: (action: ReactNode | null) => void;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);
  const [actions, setActions] = useState<ReactNode | null>(null);

  return (
    <HeaderContext.Provider
      value={{
        title,
        setTitle,
        breadcrumbs,
        setBreadcrumbs,
        actions,
        setActions,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  return context;
};
