import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface HeaderProps {
  onOpenAiChat: () => void;
  onSearch: (query: string) => void;
}

export function Header({ onOpenAiChat, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <i className="fas fa-chevron-left text-sm" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <i className="fas fa-chevron-right text-sm" />
            </Button>
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Şarkı, sanatçı veya AI'ya sor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 bg-gray-800 border-gray-700 pl-10 pr-4 py-2 rounded-full focus:ring-2 focus:ring-purple-500/50 focus:bg-gray-700 transition-all"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={onOpenAiChat}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <i className="fas fa-robot mr-2" />
            AI Asistanı
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <i className="fas fa-bell text-sm" />
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-sm text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
