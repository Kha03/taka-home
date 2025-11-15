import { Home } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  href?: string;
  label: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations("common");
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link
        href="/"
        className="flex items-center transition-colors w-7 h-7 justify-center rounded-full hover:bg-secondary/20 bg-[#e2e2e2] "
      >
        <Home className="h-4 w-4" />
      </Link>

      <Link href="/" className="hover:text-foreground transition-colors">
        {t("home")}
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-muted-foreground">/</span>
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? "text-foreground font-bold" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
