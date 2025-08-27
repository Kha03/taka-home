/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

export function UserMenu() {
  return (
    <div className="flex items-center gap-6">
      <button className="px-5 h-11.5 border border-primary rounded-lg text-primary font-semibold bg-white hover:bg-[#F4F4F5] transition cursor-pointer flex items-center">
        Become a Partner
        <span className="ml-1">
          <img src="/assets/icons/arrow-menu.svg" alt="Chevron down" />
        </span>
      </button>
      <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary">
        <img
          src="/assets/imgs/avatar.png"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </button>
      <span className="ml-1 font-medium text-foreground cursor-pointer flex items-center">
        Aunto
        <span>
          <img
            src="/assets/icons/arrow-menu.svg"
            alt="Chevron down"
            className="ml-1"
          />
        </span>
      </span>
    </div>
  );
}
