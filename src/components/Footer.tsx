import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-gradient-soft">
      <div className="container py-12 grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Transformando experiências invisíveis em dados coletivos que revelam a segurança real das empresas.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-display text-base font-semibold mb-2">Promessa</p>
          <p className="text-muted-foreground">Nenhum dado pessoal é coletado.</p>
          <p className="text-muted-foreground">Relatos só se tornam visíveis quando seguros.</p>
          <p className="text-muted-foreground">Sua identidade nunca será exposta.</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-display text-base font-semibold mb-2">Em emergência</p>
          <p className="text-muted-foreground">Disque 180 — Central de Atendimento à Mulher</p>
          <p className="text-muted-foreground">Disque 190 — Polícia Militar</p>
        </div>
      </div>
      <div className="container pb-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Íris · Ver antes de confiar.
      </div>
    </footer>
  );
}