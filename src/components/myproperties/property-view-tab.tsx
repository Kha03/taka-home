import { cn } from "@/lib/utils/utils";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Building2, Home } from "lucide-react";

interface PropertyViewTabProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function PropertyViewTab({
  activeView,
  setActiveView,
}: PropertyViewTabProps) {
  const t = useTranslations("myProperties");

  const viewTabs = [
    { id: "unit", label: t("manageByUnit"), icon: Building2 },
    { id: "room", label: t("manageByRoom"), icon: Home },
  ];

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
