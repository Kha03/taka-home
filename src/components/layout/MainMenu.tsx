/* eslint-disable @next/next/no-img-element */
export function MainMenu() {
  return (
    <nav className="flex gap-11 items-center text-[16px] font-medium text-foreground">
      <div className="relative group cursor-pointer flex items-center font-medium">
        Earn with ToletX
        <span className="ml-1 flex items-center">
          <img src="/assets/icons/arrow-menu.svg" alt="Arrow menu" />
        </span>
      </div>
      <div className="relative group cursor-pointer flex items-center font-medium">
        Property Category
        <span className="ml-1 flex items-center">
          <img src="/assets/icons/arrow-menu.svg" alt="Arrow menu" />
        </span>
      </div>
      <div className="relative group cursor-pointer flex items-center font-medium">
        Hive
        <span className="ml-1 flex items-center">
          <img src="/assets/icons/arrow-menu.svg" alt="Arrow menu" />
        </span>
      </div>
      <div className="relative group cursor-pointer flex items-center font-medium">
        Office Shifting Services
        <span className="ml-1 flex items-center">
          <img src="/assets/icons/arrow-menu.svg" alt="Arrow menu" />
        </span>
      </div>
    </nav>
  );
}
