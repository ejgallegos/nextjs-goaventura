
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from 'react';

interface NavLinkProps {
  href: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

const NavLink = ({ href, label, icon: Icon }: NavLinkProps) => {
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
        className={cn(navigationMenuTriggerStyle(), "font-body text-base hover:bg-transparent flex items-center gap-2")}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {label}
      </Link>
    </NavigationMenuLink>
  );
};

export default NavLink;
