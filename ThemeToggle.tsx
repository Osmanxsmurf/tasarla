import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label="Tema Değiştir"
    >
      {theme === "dark" ? (
        <Moon size={20} className="rotate-0 scale-100 transition-all" />
      ) : (
        <Sun size={20} className="rotate-0 scale-100 transition-all" />
      )}
    </Button>
  );
}
