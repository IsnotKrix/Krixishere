"use client";

import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, ScrollText } from "lucide-react";

const navItems = [
  { name: "Home",      url: "/",           icon: Home },
  { name: "Changelog", url: "/changelog",  icon: ScrollText },
];

export function PortfolioNav() {
  return <NavBar items={navItems} />;
}
