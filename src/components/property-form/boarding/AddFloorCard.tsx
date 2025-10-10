"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function AddFloorCard({
  onAdd,
  nextFloorName,
}: {
  onAdd: () => void;
  nextFloorName: string;
}) {
  return (
    <Card
      className="group overflow-hidden bg-primary-foreground rounded-[8px] border-accent/60 border-dashed p-2 gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
      onClick={onAdd}
    >
      <div className="items-center justify-center flex gap-2">
        <CardTitle className="text-xs px-2.5 py-1 bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary rounded-[30px] font-bold transition-all duration-200">
          {nextFloorName}
        </CardTitle>
      </div>
      <CardContent className="p-0 flex items-center justify-center">
        <div className="flex items-center justify-center py-4 bg-accent group-hover:bg-primary h-10 w-10 mt-5 rounded-full transition-all duration-200">
          <Plus className="h-4 w-4 text-primary group-hover:text-white transition-colors duration-200" />
        </div>
      </CardContent>
    </Card>
  );
}
