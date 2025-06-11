import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className, autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const [location, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        // If no onSearch prop, navigate to search page with query
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Şarkı, sanatçı veya ruh hali ara..."
          value={query}
          onChange={handleChange}
          className="w-full bg-secondary pl-10 rounded-full focus:ring-2 focus:ring-primary"
        />
      </div>
    </form>
  );
};

export default SearchBar;
