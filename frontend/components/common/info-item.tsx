import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type * as React from "react";

interface InfoItemProps extends React.ComponentProps<"div"> {
  logo: string;
  initials: string;
  primaryText: string;
  secondaryText?: string;
}

export function InfoItem({ logo, initials, primaryText, secondaryText, className, ...props }: InfoItemProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <Avatar>
        <AvatarImage src={logo} />
        <AvatarFallback>{getInitials(initials)}</AvatarFallback>
      </Avatar>
      <div className="grid">
        <div>{primaryText}</div>
        <div className="text-xs">{secondaryText}</div>
      </div>
    </div>
  );
}
