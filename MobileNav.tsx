import { Link } from "wouter";
import { Home, Search, Library, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  activeRoute: string;
};

export default function MobileNav({ activeRoute }: MobileNavProps) {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border h-14 z-30 md:hidden">
      <div className="flex justify-around items-center h-full">
        <Link href="/">
          <a className="flex flex-col items-center text-center px-2">
            <Home className={cn(
              "h-5 w-5",
              activeRoute === "/" ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              activeRoute === "/" ? "text-primary" : "text-muted-foreground"
            )}>Keşfet</span>
          </a>
        </Link>
        
        <Link href="/search">
          <a className="flex flex-col items-center text-center px-2">
            <Search className={cn(
              "h-5 w-5",
              activeRoute === "/search" ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              activeRoute === "/search" ? "text-primary" : "text-muted-foreground"
            )}>Ara</span>
          </a>
        </Link>
        
        <Link href="/library">
          <a className="flex flex-col items-center text-center px-2">
            <Library className={cn(
              "h-5 w-5",
              activeRoute === "/library" ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              activeRoute === "/library" ? "text-primary" : "text-muted-foreground"
            )}>Kitaplık</span>
          </a>
        </Link>
        
        <Link href="/assistant">
          <a className="flex flex-col items-center text-center px-2">
            <Bot className={cn(
              "h-5 w-5",
              activeRoute === "/assistant" ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              activeRoute === "/assistant" ? "text-primary" : "text-muted-foreground"
            )}>Asistan</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
