import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-1.5 text-xs text-slate-500 ${className}`} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-forest-700 flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-forest-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
