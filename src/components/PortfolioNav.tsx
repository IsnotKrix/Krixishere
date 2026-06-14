"use client";

import { useState } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, ScrollText, User, Key, LogOut, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProfileDialog } from "@/components/EditProfileDialog";

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
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<"Profile" | "Passkeys">("Profile");

  const avatarSlot = session?.user ? (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className="relative cursor-pointer px-1.5 py-1.5 rounded-full transition-colors hover:bg-white/5 focus:outline-none"
            aria-label="User menu"
          >
            <UserAvatar src={session.user.image} name={session.user.name} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-52">
          <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
            <span className="font-semibold text-sm text-foreground">
              {session.user.name}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => { setProfileTab("Profile"); setTimeout(() => setProfileOpen(true), 0); }}
          >
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => { setProfileTab("Passkeys"); setTimeout(() => setProfileOpen(true), 0); }}
          >
            <Key className="h-4 w-4 mr-2" />
            Manage Passkeys
          </DropdownMenuItem>
          {session.user.isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => { window.location.href = "/admin" }}
              >
                <Shield className="h-4 w-4 mr-2 text-violet-400" />
                Admin Panel
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            onSelect={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileDialog open={profileOpen} onOpenChange={setProfileOpen} initialTab={profileTab} />
    </>
  ) : null;

  return <NavBar items={navItems} rightSlot={avatarSlot} />;
}
