import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Moon, Music, Search, Sun, User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      // Implement search functionality here
      console.log("Searching for:", searchQuery);
    }
  };
  
  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };
  
  // Format user initials for avatar
  const getUserInitials = (): string => {
    if (!user || !user.fullName) return "?";
    
    const names = user.fullName.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <header className="bg-card h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-border sticky top-0 z-20">
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Music className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl md:text-2xl font-bold text-foreground hidden md:block">MüzikAI</h1>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Müzik ara..."
            className="bg-muted w-full py-2 px-4 pr-10 rounded-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-7 w-7"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* User Menu */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-muted-foreground"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="relative mr-2"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                <AvatarImage src={user?.profilePicture || ""} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm font-medium hidden md:block">{user?.fullName}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleUserMenuClick("profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleUserMenuClick("logout")}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
