import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";

export function Logo() {
  return (
    <>
      <Link href="/" className="flex items-center h-20.5 px-2">
        <Image
          src="/assets/logos/logoHome.svg"
          alt="ToletX Logo"
          width={116}
          height={67}
          priority
        />
      </Link>
    </>
  );
}
