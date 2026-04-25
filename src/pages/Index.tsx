import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScoreBadge from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import logo from "@/assets/iris-logo.png";
import { ShieldCheck, Layers, Users, Lock, ArrowRight, Sparkles } from "lucide-react";
import { COMPANIES, loadReports, scoreForCompany } from "@/lib/iris";
import { useMemo } from "react";

const Index = () => {
  const reports = useMemo(() => loadReports(), []);
  const featured = useMemo(
    () =>
      COMPANIES.slice(0, 3).map((c) => ({ company: c, score: scoreForCompany(c.slug, reports) })),
    [reports],
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-accent/40 blur-3xl pointer-events-none" />
          <div className="container relative py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border/60 text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Anônimo · Coletivo · Confiável
              </span>
              <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[0.95] tracking-tight">
                Ver antes de <span className="italic text-primary">confiar.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
                Íris transforma relatos anônimos em métricas coletivas que revelam a segurança real de cada empresa — protegendo quem fala.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild variant="petal" size="xl">
                  <Link to="/empresas">Explorar empresas <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="soft" size="xl">
                  <Link to="/relato">Fazer relato anônimo</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-safe" /> 100% anônimo</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-safe" /> Sem dados pessoais expostos</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-safe" /> Identidade protegida</span>
              </div>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-petal blur-3xl opacity-40 rounded-full" />
                <img src={logo} alt="" className="relative h-72 md:h-96 w-auto animate-float drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* PROMISE */}
        <section className="container py-20 md:py-28">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-medium text-primary mb-3">Como Íris protege você</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              Sua experiência vira dado coletivo. Nunca exposição individual.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Lock,
                title: "Anonimato real",
                desc: "Seu nome e dados não são exibidos. Mesmo com login, seus relatos permanecem anônimos.",
              },
              {
                icon: Layers,
                title: "Blindagem por volume",
                desc: "Relatos só aparecem publicamente quando há pelo menos 3 ocorrências similares. Antes disso, ninguém vê.",
              },
              {
                icon: Users,
                title: "Padrões, não pessoas",
                desc: "Exibimos tendências por empresa e setor — nunca casos individuais que possam te identificar.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-3xl bg-card border border-border/60 p-7 shadow-soft hover:shadow-petal transition-smooth">
                <div className="h-11 w-11 rounded-2xl bg-gradient-petal flex items-center justify-center mb-5 shadow-soft">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gradient-soft border-y border-border/60">
          <div className="container py-20 md:py-28">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-medium text-primary mb-3">Como funciona</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
                Três passos. Zero exposição.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { n: "01", t: "Você relata em 2 minutos", d: "Empresa, setor, tipo, gravidade. Sem identificação." },
                { n: "02", t: "Agrupamos por padrão", d: "Cruzamos relatos similares por empresa, setor e tipo de ocorrência." },
                { n: "03", t: "Liberamos quando seguro", d: "Padrões só aparecem com 3+ relatos — protegendo cada voz individual." },
              ].map((s) => (
                <div key={s.n} className="relative">
                  <div className="font-display text-6xl text-primary/30 font-semibold leading-none mb-4">{s.n}</div>
                  <h3 className="font-display text-2xl font-semibold mb-2">{s.t}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED COMPANIES */}
        <section className="container py-20 md:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-primary mb-3">Empresas em destaque</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
                Ambientes avaliados por dentro.
              </h2>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/empresas">Ver todas <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map(({ company, score }) => (
              <Link key={company.slug} to={`/empresa/${company.slug}`} className="group rounded-3xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-petal transition-smooth hover:-translate-y-1">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{company.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{company.industry}</p>
                  </div>
                  <ScoreBadge level={score.level} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {score.patterns[0]
                    ? `Padrão de ${score.patterns[0].occurrence.toLowerCase()} em ${score.patterns[0].sector}.`
                    : "Sem padrões públicos. Relatos isolados protegidos."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-petal p-10 md:p-16 shadow-petal">
            <Sparkles className="absolute top-8 right-10 h-8 w-8 text-primary-foreground/40" />
            <div className="max-w-2xl text-primary-foreground">
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
                Sua segurança vem primeiro.
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Cada relato anônimo ajuda a próxima mulher a tomar uma decisão mais segura sobre onde trabalhar.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="xl" className="bg-card text-foreground hover:bg-card/90 rounded-full">
                  <Link to="/relato">Fazer relato agora</Link>
                </Button>
                <Button asChild variant="ghost" size="xl" className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
                  <Link to="/apoio">Buscar apoio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
