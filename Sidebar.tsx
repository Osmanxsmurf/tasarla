import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CircleUser, Home, Library, ListMusic, LayoutGrid, Heart, History, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type SidebarProps = {
  activeRoute: string;
};

export default function Sidebar({ activeRoute }: SidebarProps) {
  const { user } = useAuth();
  
  // Fetch user playlists
  const { data: playlists } = useQuery({
    queryKey: ["/api/playlists"],
    enabled: !!user,
  });
  
  return (
    <aside className="bg-sidebar h-full w-20 md:w-64 flex-shrink-0 flex flex-col border-r border-sidebar-border hidden md:flex">
      <nav className="flex-1 pt-4">
        <ul>
          <li className="mb-2 px-3">
            <Link href="/">
              <a className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-sidebar-accent transition",
                activeRoute === "/" && "bg-sidebar-accent text-sidebar-primary"
              )}>
                <Home className="h-5 w-5 md:h-5 md:w-5" />
                <span className="ml-3 text-sm font-medium hidden md:block">Keşfet</span>
              </a>
            </Link>
          </li>
          
          <li className="mb-2 px-3">
            <Link href="/library">
              <a className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-sidebar-accent transition",
                activeRoute === "/library" && "bg-sidebar-accent text-sidebar-primary"
              )}>
                <Library className="h-5 w-5 md:h-5 md:w-5" />
                <span className="ml-3 text-sm font-medium hidden md:block">Kitaplık</span>
              </a>
            </Link>
          </li>
          
          <li className="mb-2 px-3">
            <Link href="/assistant">
              <a className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-sidebar-accent transition",
                activeRoute === "/assistant" && "bg-sidebar-accent text-sidebar-primary"
              )}>
                <Bot className="h-5 w-5 md:h-5 md:w-5" />
                <span className="ml-3 text-sm font-medium hidden md:block">AI Asistan</span>
              </a>
            </Link>
          </li>
          
          <li className="mb-2 px-3">
            <Link href="/profile">
              <a className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-sidebar-accent transition",
                activeRoute === "/profile" && "bg-sidebar-accent text-sidebar-primary"
              )}>
                <CircleUser className="h-5 w-5 md:h-5 md:w-5" />
                <span className="ml-3 text-sm font-medium hidden md:block">Profil</span>
              </a>
            </Link>
          </li>
        </ul>
        
        <div className="mt-8 px-6 hidden md:block">
          <h3 className="text-xs uppercase text-muted-foreground font-medium mb-3">Kitaplık</h3>
          <ul>
            <li className="mb-2">
              <Link href="/library/liked">
                <a className="flex items-center py-2 text-sm hover:text-foreground transition">
                  <Heart className="h-4 w-4 text-red-500 mr-3" />
                  Beğendiklerim
                </a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/library/recent">
                <a className="flex items-center py-2 text-sm hover:text-foreground transition">
                  <History className="h-4 w-4 text-muted-foreground mr-3" />
                  Son Çalınanlar
                </a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/library/playlists">
                <a className="flex items-center py-2 text-sm hover:text-foreground transition">
                  <ListMusic className="h-4 w-4 text-muted-foreground mr-3" />
                  Çalma Listeleri
                </a>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 px-6 hidden md:block">
          <h3 className="text-xs uppercase text-muted-foreground font-medium mb-3">Çalma Listeleri</h3>
          <ul>
            {playlists && playlists.length > 0 ? (
              playlists.map((playlist: any) => (
                <li className="mb-2" key={playlist.id}>
                  <Link href={`/playlist/${playlist.id}`}>
                    <a className="flex items-center py-2 text-sm hover:text-foreground transition">
                      <ListMusic className="h-4 w-4 text-muted-foreground mr-3" />
                      {playlist.name}
                    </a>
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground py-2">Henüz çalma listeniz yok</li>
            )}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
