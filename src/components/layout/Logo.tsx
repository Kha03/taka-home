import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center h-20.5 px-2">
      <Image
        src="/assets/logos/logoHome.svg"
        alt="ToletX Logo"
        width={226}
        height={85}
        priority
      />
    </Link>
  );
}
