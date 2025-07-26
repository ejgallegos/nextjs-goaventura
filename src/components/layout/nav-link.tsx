
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink = ({ href, label }: NavLinkProps) => {
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    setIsExternal(href.startsWith('http'));
  }, [href]);

  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={cn(navigationMenuTriggerStyle(), "font-body text-base hover:bg-transparent")}
      >
        {label}
      </Link>
    </NavigationMenuLink>
  );
};

export default NavLink;
