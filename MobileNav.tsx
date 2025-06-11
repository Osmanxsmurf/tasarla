import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Home, Search, Disc, User } from 'lucide-react';

const MobileNav = () => {
  const [location] = useLocation();

  const isActiveRoute = (route: string) => {
    return location === route;
  };

  return (
    <nav className="md:hidden fixed bottom-20 left-0 right-0 bg-card border-t border-border z-40">
      <div className="flex justify-around">
        <Link href="/">
          <div className="flex flex-col items-center py-2 px-4 text-sm">
            <Home className={cn(
              "w-6 h-6",
              isActiveRoute("/") ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              isActiveRoute("/") ? "text-primary" : "text-muted-foreground"
            )}>Ana Sayfa</span>
          </div>
        </Link>
        <Link href="/explore">
          <div className="flex flex-col items-center py-2 px-4 text-sm">
            <Search className={cn(
              "w-6 h-6",
              isActiveRoute("/explore") ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              isActiveRoute("/explore") ? "text-primary" : "text-muted-foreground"
            )}>Keşfet</span>
          </div>
        </Link>
        <Link href="/albums">
          <div className="flex flex-col items-center py-2 px-4 text-sm">
            <Disc className={cn(
              "w-6 h-6",
              isActiveRoute("/albums") ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              isActiveRoute("/albums") ? "text-primary" : "text-muted-foreground"
            )}>Müzik</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className="flex flex-col items-center py-2 px-4 text-sm">
            <User className={cn(
              "w-6 h-6",
              isActiveRoute("/profile") ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              isActiveRoute("/profile") ? "text-primary" : "text-muted-foreground"
            )}>Profil</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
