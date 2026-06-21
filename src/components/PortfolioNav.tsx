"use client";

import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, ScrollText, LogOut, Shield } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home",      url: "/",           icon: Home },
  { name: "Changelog", url: "/changelog",  icon: ScrollText },
];

function UserAvatar({ src, name }: { src?: string | null; name?: string | null }) {
  if (src) {
    return (
      <img src={src} alt={name ?? "User"} className="w-7 h-7 rounded-full object-cover" />
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold select-none">
      {name?.[0]?.toUpperCase() ?? "K"}
    </div>
  );
}

export function PortfolioNav() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const avatarSlot = user ? (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative cursor-pointer px-1.5 py-1.5 rounded-full transition-colors hover:bg-white/5 focus:outline-none"
          aria-label="User menu"
        >
          <UserAvatar src={user.imageUrl} name={user.fullName ?? user.username} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
          <span className="font-semibold text-sm text-foreground">
            {user.fullName ?? user.username}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(user.publicMetadata as { isAdmin?: boolean })?.isAdmin === true && (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => { window.location.href = "/admin" }}
            >
              <Shield className="h-4 w-4 mr-2 text-violet-400" />
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          onSelect={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  return <NavBar items={navItems} rightSlot={avatarSlot} />;
}
