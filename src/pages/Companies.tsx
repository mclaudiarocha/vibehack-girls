import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScoreBadge from "@/components/ScoreBadge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANIES, loadReports, scoreForCompany, SECTORS, type ScoreLevel } from "@/lib/iris";
import { Search, ArrowRight } from "lucide-react";

export default function Companies() {
  const reports = useMemo(() => loadReports(), []);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("todos");
  const [risk, setRisk] = useState<string>("todos");

  const data = useMemo(() => {
    return COMPANIES.map((c) => ({ company: c, score: scoreForCompany(c.slug, reports) }))
      .filter(({ company, score }) => {
        if (q && !company.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (sector !== "todos" && !score.patterns.some((p) => p.sector === sector)) {
          // also allow industry match
          if (company.industry.toLowerCase() !== sector.toLowerCase()) return false;
        }
        if (risk !== "todos" && score.level !== risk) return false;
        return true;
      })
      .sort((a, b) => {
        const order: Record<ScoreLevel, number> = { risco: 0, atencao: 1, seguro: 2, insuficiente: 3 };
        return order[a.score.level] - order[b.score.level];
      });
  }, [reports, q, sector, risk]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border/60">
          <div className="container py-14 md:py-20">
            <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl leading-[1.05]">
              Empresas avaliadas por quem viveu lá dentro.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl text-lg">
              Padrões só aparecem quando há volume suficiente para proteger quem relatou.
            </p>
          </div>
        </section>

        <section className="container py-10">
          <div className="grid gap-3 md:grid-cols-[1fr,200px,200px] mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-11 h-12 rounded-full bg-card"
              />
            </div>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="h-12 rounded-full bg-card"><SelectValue placeholder="Setor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os setores</SelectItem>
                {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={risk} onValueChange={setRisk}>
              <SelectTrigger className="h-12 rounded-full bg-card"><SelectValue placeholder="Nível" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os níveis</SelectItem>
                <SelectItem value="seguro">Seguro</SelectItem>
                <SelectItem value="atencao">Atenção</SelectItem>
                <SelectItem value="risco">Risco elevado</SelectItem>
                <SelectItem value="insuficiente">Dados insuficientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map(({ company, score }) => {
              const top = score.patterns[0];
              return (
                <Link
                  key={company.slug}
                  to={`/empresa/${company.slug}`}
                  className="group rounded-3xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-petal transition-smooth hover:-translate-y-1 animate-fade-up"
                >
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{company.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{company.industry} · {company.size}</p>
                    </div>
                    <ScoreBadge level={score.level} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                    {top
                      ? `Padrão de ${top.occurrence.toLowerCase()} identificado em ${top.sector}.`
                      : "Sem padrões identificados publicamente. Relatos isolados permanecem protegidos."}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{score.visibleReports} relatos no padrão · últimos 6 meses</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-smooth text-primary" />
                  </div>
                </Link>
              );
            })}
            {data.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                Nenhuma empresa encontrada com esses filtros.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}