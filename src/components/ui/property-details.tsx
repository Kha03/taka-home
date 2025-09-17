/* eslint-disable @next/next/no-img-element */

interface PropertyDetailsProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export function PropertyDetails({
  bedrooms,
  bathrooms,
  area,
}: PropertyDetailsProps) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-primary border-b border-[#e5e5e5] pb-2.5">
      <div className="flex items-center gap-1">
        <img src="/assets/icons/bed-icon.svg" alt="bed" />
        <span>Bed {bedrooms}</span>
      </div>

      <div className="flex items-center gap-1 border-x border-[#e5e5e5] px-4">
        <img src="/assets/icons/bath-icon.svg" alt="bath" />
        <span>Bath {bathrooms}</span>
      </div>

      <div className="flex items-center gap-1">
        <img src="/assets/icons/space-icon.svg" alt="area" />
        <span>{area} m²</span>
      </div>
    </div>
  );
}
