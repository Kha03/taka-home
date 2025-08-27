/* eslint-disable @next/next/no-img-element */
export function IconActions() {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <button className="w-11 h-11 p-2.5 flex items-center justify-center rounded-lg border border-[#C868D7] bg-white">
          <img src="/assets/icons/message.svg" alt="Message icon" />
        </button>
        {/* Badge for unread messages */}
        <span className="absolute top-1 right-1 w-[12px] h-[12px] px-1 flex items-center justify-center text-[8px] font-semibold text-white bg-[#FF0004] rounded-full">
          3
        </span>
      </div>
      <button className="w-11 h-11 p-2.5 flex items-center justify-center rounded-lg border border-[#347BC5] bg-white">
        <img src="/assets/icons/bell.svg" alt="Notification icon" />
      </button>
    </div>
  );
}
