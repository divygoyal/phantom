import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="size-8 rounded-xl bg-hero grid place-items-center shadow-[var(--shadow-glow)]">
            <Sparkles className="size-4 text-white" />
          </span>
          ReelForge
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/live-run" className="hover:text-foreground transition">Live Run</Link>
          <Link href="/analytics" className="hover:text-foreground transition">Analytics</Link>
          <Link href="/prompts" className="hover:text-foreground transition">Prompts</Link>
          <Link href="/settings" className="hover:text-foreground transition">Settings</Link>
        </nav>
        <Button size="sm" asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          <Link href="/#generate">Try free <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </header>
  );
}
