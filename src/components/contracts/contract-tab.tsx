import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const tabs = [
  { id: "all", label: "Tất cả", count: 12 },
  { id: "active", label: "Còn hiệu lực", count: 2 },
  { id: "expired", label: "Hết hiệu lực", count: 10 },
];
interface Tab {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export default function ContractTab({ activeTab, setActiveTab }: Tab) {
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
