"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Tv,
  FolderOpen,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/media", label: "Tous les médias", icon: Film },
  { href: "/admin/media/movies", label: "Films", icon: Film },
  { href: "/admin/media/series", label: "Séries", icon: Tv },
  { href: "/admin/categories", label: "Catégories", icon: FolderOpen },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-secondary border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Movio TV</h1>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-red-600 text-white"
                  : "hover:bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Retour au site</span>
        </Link>
      </div>
    </aside>
  );
}
