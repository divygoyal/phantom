"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ghost,
  Activity,
  BarChart3,
  GitBranch,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Channel", icon: Sparkles },
  { href: "/live-run", label: "Live Run", icon: Activity },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/prompts", label: "Prompts", icon: GitBranch },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-800/80 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-400/10 ring-1 ring-cyan-400/30">
          <Ghost className="h-4 w-4 text-cyan-400" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-zinc-50">
          Phantom
        </span>
        <span className="ml-auto rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan-300">
          beta
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-zinc-900 text-zinc-50 ring-1 ring-zinc-800"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800/80 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-zinc-950">
            ai
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium text-zinc-200">
              @aisimplified
            </span>
            <span className="truncate text-xs text-zinc-500">
              50,400 subscribers
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
