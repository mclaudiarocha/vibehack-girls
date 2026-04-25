import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScoreBadge from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import { COMPANIES, loadReports, scoreForCompany, MIN_THRESHOLD, LEVEL_LABEL } from "@/lib/iris";
import { ArrowLeft, ShieldCheck, Lock, Sparkles } from "lucide-react";

export default function CompanyDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const company = COMPANIES.find((c) => c.slug === slug);
  const reports = useMemo(() => loadReports(), []);
  if (!company) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container py-24 text-center flex-1">
          <p>Empresa não encontrada.</p>
          <Button onClick={() => nav("/empresas")} className="mt-4">Voltar</Button>
        </main>
        <Footer />
      </div>
    );
  }
  const score = scoreForCompany(company.slug, reports);

  // top occurrences and sectors (only from visible patterns)
  const occurrenceCounts = new Map<string, number>();
  const sectorCounts = new Map<string, number>();
  for (const p of score.patterns) {
    occurrenceCounts.set(p.occurrence, (occurrenceCounts.get(p.occurrence) ?? 0) + p.count);
    sectorCounts.set(p.sector, (sectorCounts.get(p.sector) ?? 0) + p.count);
  }
  const topOccurrences = [...occurrenceCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topSectors = [...sectorCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border/60">
          <div className="container py-12">
            <Link to="/empresas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
              <ArrowLeft className="h-4 w-4" /> Voltar para empresas
            </Link>
            <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{company.industry} · {company.size}</p>
                <h1 className="font-display text-4xl md:text-5xl font-semibold">{company.name}</h1>
              </div>
              <ScoreBadge level={score.level} size="lg" />
            </div>
          </div>
        </section>

        <section className="container py-10 grid gap-6 lg:grid-cols-3">
          {/* Score card */}
          <div className="lg:col-span-2 rounded-3xl bg-card border border-border/60 p-8 shadow-soft animate-fade-up">
            <h2 className="font-display text-2xl font-semibold mb-1">Índice de Segurança</h2>
            <p className="text-sm text-muted-foreground mb-6">Calculado a partir de volume, frequência e gravidade dos relatos visíveis nos últimos 6 meses.</p>

            {score.level === "insuficiente" ? (
              <div className="rounded-2xl bg-muted p-6 text-center">
                <Lock className="h-6 w-6 mx-auto text-primary mb-3" />
                <p className="font-medium">Ainda não há padrões públicos.</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Relatos individuais permanecem protegidos. Padrões só aparecem com pelo menos {MIN_THRESHOLD} relatos similares.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4 mb-6">
                  <div className="font-display text-6xl font-semibold leading-none">{score.score}</div>
                  <div className="text-sm text-muted-foreground pb-2">/ 100 · {LEVEL_LABEL[score.level]}</div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden mb-8">
                  <div
                    className={`h-full rounded-full transition-smooth ${
                      score.level === "seguro" ? "bg-safe" : score.level === "atencao" ? "bg-warn" : "bg-risk"
                    }`}
                    style={{ width: `${score.score}%` }}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Ocorrências mais comuns</p>
                    <ul className="space-y-2">
                      {topOccurrences.map(([k, v]) => (
                        <li key={k} className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-2.5">
                          <span className="text-sm font-medium">{k}</span>
                          <span className="text-xs text-muted-foreground">{v} relatos</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Setores com maior incidência</p>
                    <ul className="space-y-2">
                      {topSectors.map(([k, v]) => (
                        <li key={k} className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-2.5">
                          <span className="text-sm font-medium">{k}</span>
                          <span className="text-xs text-muted-foreground">{v} relatos</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Side */}
          <aside className="space-y-4">
            <div className="rounded-3xl bg-gradient-soft border border-border/60 p-6">
              <ShieldCheck className="h-5 w-5 text-primary mb-2" />
              <p className="font-display text-lg font-semibold mb-1">Como o índice é calculado</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Combinamos volume de relatos, recorrência e gravidade. Quanto mais consistente o padrão, maior o impacto no score.
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-soft border border-border/60 p-6">
              <Sparkles className="h-5 w-5 text-primary mb-2" />
              <p className="font-display text-lg font-semibold mb-1">Você viveu algo aqui?</p>
              <p className="text-sm text-muted-foreground mb-4">Seu relato pode ajudar outras mulheres. Anônimo, sempre.</p>
              <Button asChild variant="petal" className="w-full rounded-full">
                <Link to="/relato">Fazer relato anônimo</Link>
              </Button>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}