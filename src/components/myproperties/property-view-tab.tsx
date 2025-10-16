import { cn } from "@/lib/utils/utils";
import { Button } from "../ui/button";
import { Building2, Home } from "lucide-react";

const viewTabs = [
  { id: "unit", label: "Quản lý theo căn", icon: Building2 },
  { id: "room", label: "Quản lý theo phòng", icon: Home },
];

interface PropertyViewTabProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function PropertyViewTab({
  activeView,
  setActiveView,
}: PropertyViewTabProps) {
  return (
    <div className="flex gap-2 bg-primary-foreground rounded-[30px] p-2 shadow-none w-fit border border-secondary mb-2.5">
      {viewTabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <Button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={cn(
              "px-4 py-3 rounded-full text-sm font-bold transition-all bg-transparent flex items-center gap-2 text-primary hover:text-primary-foreground/80 hover:bg-accent/80",
              activeView === tab.id ? "bg-accent text-primary-foreground" : ""
            )}
          >
            <IconComponent className="w-4 h-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
