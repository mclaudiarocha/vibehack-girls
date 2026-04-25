import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/empresas", label: "Empresas" },
  { to: "/apoio", label: "Apoio" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container flex items-center justify-between h-16">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Button asChild variant="petal" size="sm" className="rounded-full">
          <NavLink to="/relato">Fazer relato</NavLink>
        </Button>
      </div>
    </header>
  );
}