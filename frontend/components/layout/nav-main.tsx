"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Item, Items, NavMainGroupProps } from "@/consts/sidebar-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavMain({ groups }: NavMainGroupProps) {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => {
        if (!group.items.length) return null;

        return (
          <SidebarGroup key={group.title} className="pt-0 pb-1">
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => renderMenuItem(item, pathname, state))}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}

function renderMenuItem(item: Items, pathname: string, sidebarState: string) {
  if (!item.items)
    return <SideBarMenuLink key={item.title} item={item} pathname={pathname} />;

  return sidebarState === "collapsed" ? (
    <SidebarMenuCollapsibleDropdown
      key={item.title}
      item={item}
      pathname={pathname}
    />
  ) : (
    <SidebarMenuCollapsible key={item.title} item={item} pathname={pathname} />
  );
}

function SideBarMenuLink({ item, pathname }: { item: Item; pathname: string }) {
  const isActive = isMenuActive(item, pathname);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span className="font-medium">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsibleDropdown({
  item,
  pathname,
}: {
  item: Items;
  pathname: string;
}) {
  const isActive = isMenuActive(item, pathname);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items?.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                href={sub.url}
                className={isMenuActive(sub, pathname) ? "bg-secondary" : ""}
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({
  item,
  pathname,
}: {
  item: Items;
  pathname: string;
}) {
  const isActive = isMenuActive(item, pathname);

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isMenuActive(subItem, pathname)}
                >
                  <Link href={subItem.url}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function isMenuActive(item: Item | Items, pathname: string): boolean {
  if (pathname === item.url) return true;

  if ("items" in item && Array.isArray(item.items)) {
    return item.items.some((sub) => isMenuActive(sub, pathname));
  }

  if (item.url === "/settings/profile") {
    const profileChildUrls = ["/settings/profile", "/settings/security"];
    return profileChildUrls.includes(pathname);
  }

  return false;
}
