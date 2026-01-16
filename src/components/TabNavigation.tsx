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
  return (
    <div className="flex border-b border-border bg-card rounded-t-xl overflow-hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all relative",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
