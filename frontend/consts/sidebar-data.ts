import {
  Carrot,
  ChefHat,
  LayoutDashboard,
  LucideIcon,
  Tags,
} from "lucide-react";

export interface NavMainGroupProps {
  groups: {
    title: string;
    url: string;
    items: Items[];
  }[];
}

export type Items = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: Item[];
};

export type Item = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export const MenuPaths: NavMainGroupProps["groups"] = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Master Data",
    url: "#",
    items: [
      {
        title: "Categories",
        url: "/categories",
        icon: Tags,
      },
      {
        title: "Ingredients",
        url: "/ingredients",
        icon: Carrot,
      },
    ],
  },
  {
    title: "Management",
    url: "#",
    items: [
      {
        title: "Recipes",
        url: "/recipes",
        icon: ChefHat,
      },
    ],
  },
];
