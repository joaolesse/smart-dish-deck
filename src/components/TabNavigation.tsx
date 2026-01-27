import { Briefcase, Wallet, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "diarias" | "despesas" | "adiantamento";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "diarias" as const, label: "Diárias", icon: Briefcase },
  { id: "despesas" as const, label: "Despesas", icon: Wallet },
  { id: "adiantamento" as const, label: "Adiantamento", icon: Banknote },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="relative flex glass-card rounded-xl p-1.5 overflow-hidden">
      {/* Animated background indicator */}
      <div
        className="absolute top-1.5 bottom-1.5 bg-primary/10 rounded-lg transition-all duration-300 ease-out"
        style={{
          left: `calc(${(activeIndex / tabs.length) * 100}% + 6px)`,
          width: `calc(${100 / tabs.length}% - 12px)`,
        }}
      />
      
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative z-10 rounded-lg",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition-transform duration-200",
              isActive && "scale-110"
            )} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
