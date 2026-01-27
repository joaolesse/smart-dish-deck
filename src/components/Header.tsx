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
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container py-5 md:py-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
            <FileText className="h-7 w-7 md:h-8 md:w-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Gerador de Recibos Online
            </h1>
            <p className="text-primary-foreground/70 text-sm mt-0.5">
              Faça seu Recibo de forma prática e rápida
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 md:top-5 md:right-6 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </header>
  );
}
