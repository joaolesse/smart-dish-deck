import { FileText, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    document.documentElement.classList.toggle("dark", newValue);
  };

  return (
    <header className="header-gradient text-primary-foreground relative overflow-hidden">
      <div className="container py-6 md:py-8">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 md:h-10 md:w-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Gerador de Recibos Online
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base mt-0.5">
              Faça seu Recibo de forma prática e rápida ...
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </header>
  );
}
