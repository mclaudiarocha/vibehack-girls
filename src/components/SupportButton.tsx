import { LifeBuoy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SupportButton() {
  const { pathname } = useLocation();
  if (pathname === "/apoio") return null;
  return (
    <Link
      to="/apoio"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-gradient-petal text-primary-foreground shadow-petal hover:shadow-glow transition-smooth hover:-translate-y-0.5"
      aria-label="Preciso de ajuda"
    >
      <LifeBuoy className="h-5 w-5" />
      <span className="text-sm font-medium">Preciso de ajuda</span>
    </Link>
  );
}