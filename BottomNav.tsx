import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Compass, Library, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const [location] = useLocation();

  // Navigation items - asistanı ana sayfa yaptık, keşfet ikincil oldu
  const navItems = [
    { name: "Asistan", icon: <Sparkles size={20} />, path: "/" },
    { name: "Keşfet", icon: <Compass size={20} />, path: "/discover" },
    { name: "Kitaplık", icon: <Library size={20} />, path: "/library" },
    { name: "Profil", icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-muted z-10 pb-safe",
      className
    )}>
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link 
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-4 relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
