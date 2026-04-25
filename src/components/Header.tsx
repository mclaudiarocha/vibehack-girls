import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";

const links = [
  { to: "/empresas", label: "Empresas" },
  { to: "/apoio", label: "Apoio" },
];

export default function Header() {
  const session = useAuth();
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
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted border border-border/60 text-muted-foreground"
                title="Identidade protegida — email nunca exibido"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Sessão anônima
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
              <Button asChild variant="petal" size="sm" className="rounded-full">
                <NavLink to="/relato">Fazer relato</NavLink>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <NavLink to="/entrar">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </NavLink>
              </Button>
              <Button asChild variant="petal" size="sm" className="rounded-full">
                <NavLink to="/relato">Fazer relato</NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}