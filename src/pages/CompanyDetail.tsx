import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScoreBadge from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import {
  loadCompanies,
  loadReports,
  scoreForCompany,
  allOccurrencesForCompany,
  commentsForCompany,
  MIN_THRESHOLD,
  LEVEL_LABEL,
  RESOLUTION_LABEL,
  type ResolutionStatus,
} from "@/lib/iris";
import { ArrowLeft, ShieldCheck, Lock, Sparkles, MessageCircle, CheckCircle2, Clock, XCircle, Award, ShieldAlert } from "lucide-react";

const RES_ICON: Record<ResolutionStatus, React.ComponentType<{ className?: string }>> = {
  resolvido: CheckCircle2,
  em_andamento: Clock,
  nao_resolvido: XCircle,
};
const RES_STYLE: Record<ResolutionStatus, string> = {
  resolvido: "bg-safe/15 text-safe border-safe/30",
  em_andamento: "bg-warn/15 text-warn-foreground border-warn/40",
  nao_resolvido: "bg-risk/15 text-risk border-risk/30",
};

export default function CompanyDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const companies = useMemo(() => loadCompanies(), []);
  const company = companies.find((c) => c.slug === slug);
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
  const allOccurrences = allOccurrencesForCompany(company.slug, reports);
  const comments = commentsForCompany(company.slug, reports);
  const resolvedPct = Math.round(score.resolutionRate * 100);
  const sufficient = score.level !== "insuficiente";

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
                {score.trustSeal && (
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-1.5 rounded-full bg-gradient-petal text-primary-foreground shadow-petal">
                    <Award className="h-4 w-4" /> 🏆 Great Place to Work · Íris
                  </span>
                )}
              </div>
              <ScoreBadge level={score.level} size="lg" />
            </div>
          </div>
        </section>

        <section className="container py-10 grid gap-6 lg:grid-cols-3">
          {/* Score card */}
          <div className="lg:col-span-2 rounded-3xl bg-card border border-border/60 p-8 shadow-soft animate-fade-up">
            <h2 className="font-display text-2xl font-semibold mb-1">Nível de Segurança</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Métrica única (0–100). <strong>Quanto menor, mais seguro</strong>. Relatos verificados pesam o dobro.
            </p>

            {score.level === "insuficiente" ? (
              <div className="rounded-2xl bg-muted p-6 text-center">
                <Lock className="h-6 w-6 mx-auto text-primary mb-3" />
                <p className="font-medium">Ainda há poucos relatos para classificar.</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  São necessários pelo menos {MIN_THRESHOLD} relatos para gerar um índice confiável.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4 mb-3">
                  <div className="font-display text-6xl font-semibold leading-none">{score.riskScore}</div>
                  <div className="text-sm text-muted-foreground pb-2">/ 100 · {LEVEL_LABEL[score.level]}</div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden mb-2 relative">
                  <div
                    className={`h-full rounded-full transition-smooth ${
                      score.level === "seguro" ? "bg-safe" : score.level === "atencao" ? "bg-warn" : "bg-risk"
                    }`}
                    style={{ width: `${score.riskScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-6">
                  <span>≤ 30 Seguro</span>
                  <span>31–50 Atenção</span>
                  <span>&gt; 50 Risco</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted border border-border/60">
                    {score.totalReports} relatos no total
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-safe/10 border border-safe/30 text-safe">
                    <ShieldCheck className="h-3.5 w-3.5" /> {score.verifiedReports} verificados
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted border border-border/60 text-muted-foreground">
                    <ShieldAlert className="h-3.5 w-3.5" /> {score.totalReports - score.verifiedReports} não verificados
                  </span>
                </div>

                {score.trustSeal && (
                  <div className="rounded-2xl bg-gradient-soft border border-safe/30 p-5 mb-6 flex items-start gap-3">
                    <Award className="h-6 w-6 text-safe shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-base font-semibold">🏆 Selo Great Place to Work · Íris</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Reconhecimento por <strong>consistência</strong>: relatos verificados, alta taxa de resolução e ausência de padrões graves recorrentes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Resolution rate */}
                <div className="rounded-2xl bg-muted/50 p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Problemas resolvidos pela empresa</p>
                    <span className="font-display text-2xl font-semibold">{resolvedPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-background overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-smooth ${
                        resolvedPct >= 60 ? "bg-safe" : resolvedPct >= 30 ? "bg-warn" : "bg-risk"
                      }`}
                      style={{ width: `${resolvedPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {resolvedPct >= 60
                      ? "🟢 A empresa demonstra ação concreta sobre os relatos."
                      : resolvedPct >= 30
                      ? "🟡 Resolução parcial — muitos casos seguem em andamento."
                      : "🔴 Baixa taxa de resolução — relatos frequentemente ignorados."}
                  </p>
                </div>

                {/* Todas as ocorrências */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Todas as ocorrências registradas ({allOccurrences.length})
                  </p>
                  <ul className="space-y-2">
                    {allOccurrences.map((g) => (
                      <li
                        key={`${g.occurrence}-${g.sector}`}
                        className="rounded-xl bg-muted/60 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-sm font-medium">{g.occurrence}</p>
                            <p className="text-xs text-muted-foreground">Setor: {g.sector}</p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {g.count} {g.count === 1 ? "relato" : "relatos"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                          {g.high > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-risk/15 text-risk border border-risk/30">
                              {g.high} grave
                            </span>
                          )}
                          {g.recurrent > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-warn/15 text-warn-foreground border border-warn/40">
                              {g.recurrent} recorrente
                            </span>
                          )}
                          {g.resolved > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-safe/15 text-safe border border-safe/30">
                              {g.resolved} resolvido
                            </span>
                          )}
                          {g.inProgress > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                              {g.inProgress} em andamento
                            </span>
                          )}
                          {g.unresolved > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-risk/10 text-risk border border-risk/20">
                              {g.unresolved} não resolvido
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                    {allOccurrences.length === 0 && (
                      <li className="text-sm text-muted-foreground italic">
                        Nenhuma ocorrência registrada ainda.
                      </li>
                    )}
                  </ul>
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
                Volume ponderado (verificado = 2, não verificado = 1), gravidade, recorrência e <strong>taxa de resolução</strong>.
                Resultado é um número de 0 a 100 — quanto menor, mais seguro.
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-soft border border-border/60 p-6">
              <Sparkles className="h-5 w-5 text-primary mb-2" />
              <p className="font-display text-lg font-semibold mb-1">Você viveu algo aqui?</p>
              <p className="text-sm text-muted-foreground mb-4">Seu relato pode ajudar outras mulheres. Anônimo, sempre.</p>
              <Button asChild variant="petal" className="w-full rounded-full">
                <Link to={`/relato?empresa=${encodeURIComponent(company.name)}`}>Fazer relato anônimo</Link>
              </Button>
            </div>
          </aside>
        </section>

        {/* Comentários / Relatos */}
        <section className="container pb-16">
          <div className="rounded-3xl bg-card border border-border/60 p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-semibold">Relatos anônimos ({comments.length})</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Textos compartilhados no momento da denúncia. Sem nomes, sem identificação — ordenados pelos mais recentes.
            </p>

            {comments.length === 0 ? (
              <div className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
                Ainda não há relatos descritivos para esta empresa.
              </div>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => {
                  const Icon = RES_ICON[c.resolution];
                  return (
                    <li
                      key={c.id}
                      className="rounded-2xl border border-border/60 p-5 bg-gradient-soft"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-card border border-border/60">
                            {c.occurrence}
                          </span>
                          <span className="text-xs text-muted-foreground">· {c.sector}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${RES_STYLE[c.resolution]}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {RESOLUTION_LABEL[c.resolution]}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">"{c.description}"</p>
                      <p className="text-[11px] text-muted-foreground mt-3">
                        Anônimo · {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
