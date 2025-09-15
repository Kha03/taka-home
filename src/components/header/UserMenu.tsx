/* eslint-disable @next/next/no-img-element */

export function UserMenu() {
  return (
    <div className="flex items-center">
      <button className="w-15 h-15 rounded-full overflow-hidden border-1 border-primary">
        <img
          src="/assets/imgs/avatar.png"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
