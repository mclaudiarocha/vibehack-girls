import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const session = useAuth();
  const next = params.get("next") || "/relato";
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Já autenticado: redireciona
  if (session) {
    nav(next, { replace: true });
    return null;
  }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      signIn(email.trim());
      toast.success("Sessão iniciada com segurança.");
      // Redireciona após persistir sessão
      setTimeout(() => nav(next, { replace: true }), 50);
    } catch {
      toast.error("Não foi possível iniciar a sessão. Tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-16 md:py-24 max-w-xl">
          <div className="rounded-3xl bg-card border border-border/60 p-8 md:p-10 shadow-soft">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-petal flex items-center justify-center shadow-petal mb-6">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">
              Entrar no Íris
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Use seu email apenas para validar a sessão. Ele <strong>nunca</strong> será exibido,
              compartilhado, ou associado publicamente aos seus relatos. Seu anonimato é absoluto.
            </p>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="h-12"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Emails corporativos (ex.: <em>@suaempresa.com</em>) permitem marcar relatos como verificados.
                </p>
              </div>

              <Button
                type="submit"
                variant="petal"
                size="xl"
                disabled={!valid || submitting}
                className="w-full"
              >
                {submitting ? "Entrando..." : (<>Entrar com segurança <ArrowRight className="h-4 w-4" /></>)}
              </Button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-muted/40 border border-border/60 p-4">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                O Íris é 100% anônimo. O login serve apenas para evitar duplicidades e classificar relatos verificados —
                seu email nunca aparece em nenhum relato, comentário ou estatística pública.
              </p>
            </div>

            <p className="mt-6 text-xs text-muted-foreground text-center">
              Precisa de apoio? <Link to="/apoio" className="text-primary font-medium">Acessar canais de ajuda</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}