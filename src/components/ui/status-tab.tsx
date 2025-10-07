import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface TabItem {
  id: string;
  label: string;
  count: number;
}

interface StatusTabProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function StatusTab({
  tabs,
  activeTab,
  setActiveTab,
}: StatusTabProps) {
  return (
    <div className="flex gap-2 bg-primary-foreground rounded-[30px] p-2 shadow-none w-fit border border-secondary mb-2.5">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "px-4 py-3 rounded-full text-sm font-bold transition-all bg-transparent",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground "
              : "text-primary hover:text-primary-foreground/80"
          )}
        >
          {tab.label} ({tab.count})
        </Button>
      ))}
    </div>
  );
}
