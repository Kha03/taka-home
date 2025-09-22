import { MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

export default function MapLocation() {
  return (
    <Card className="shadow-none bg-background border-0 p-4 rounded-[12px]">
      <CardContent className="p-0">
        <div className="font-bold text-primary mb-4 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-[#D9D9D9] rounded-full">
            <MapPin className="h-3 w-3 text-primary" />
          </div>
          Vị trí bất động sản trên bản đồ
        </div>
        <div className="w-full h-[160px] rounded-lg overflow-hidden relative">
          <Image
            src="/assets/imgs/map-location.png"
            alt="Map location"
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
