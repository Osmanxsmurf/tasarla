import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  User,
  ChevronDown
} from "lucide-react";

interface TopBarProps {
  onSearch?: (query: string) => void;
}

export function TopBar({ onSearch }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Real-time search could be implemented here
  };

  return (
    <header className="flex items-center justify-between p-6 glass-effect">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative ml-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Sanatçı, şarkı veya podcast ara..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-96 bg-white/10 border-white/20 rounded-full py-3 px-6 pl-12 text-white placeholder-gray-400 focus:border-white/40 focus:bg-white/20"
            />
          </div>
        </form>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
        >
          <Bell className="w-4 h-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-3 bg-black/20 rounded-full p-2 hover:bg-black/40 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="ai-gradient text-white text-sm">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium pr-2">Kullanıcı</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="w-4 h-4 mr-2" />
              Bildirimler
            </DropdownMenuItem>
            <DropdownMenuItem>
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
