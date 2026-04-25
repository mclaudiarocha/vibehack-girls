import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  addReport,
  ensureCompany,
  loadCompanies,
  OCCURRENCES,
  SECTORS,
  RESOLUTION_LABEL,
  type Frequency,
  type Occurrence,
  type Sector,
  type Severity,
  type ResolutionStatus,
} from "@/lib/iris";
import { Lock, Heart, Check } from "lucide-react";
import { toast } from "sonner";

export default function Report() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [companyName, setCompanyName] = useState(params.get("empresa") ?? "");
  const [sector, setSector] = useState<Sector | "">("");
  const [occurrence, setOccurrence] = useState<Occurrence | "">("");
  const [frequency, setFrequency] = useState<Frequency>("pontual");
  const [severity, setSeverity] = useState<Severity>("medio");
  const [resolution, setResolution] = useState<ResolutionStatus>("nao_resolvido");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string>("");

  const valid = companyName.trim().length >= 2 && sector && occurrence;

  const knownCompanies = useMemo(() => loadCompanies(), []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const company = ensureCompany(companyName);
    addReport({
      companySlug: company.slug,
      sector: sector as Sector,
      occurrence: occurrence as Occurrence,
      frequency,
      severity,
      resolution,
      description: description.trim() || undefined,
    });
    setCreatedSlug(company.slug);
    setSubmitted(true);
    toast.success("Relato registrado com segurança.");
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container py-20 max-w-2xl">
          <div className="rounded-3xl bg-gradient-hero border border-border/60 p-10 md:p-14 text-center shadow-soft animate-bloom">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-petal flex items-center justify-center shadow-petal mb-6">
              <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">Você não está sozinha.</h1>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Seu relato foi registrado de forma anônima. Ele só ficará visível quando outros relatos similares formarem um padrão — protegendo sua identidade.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="petal" size="xl" onClick={() => nav(createdSlug ? `/empresa/${createdSlug}` : "/empresas")}>
                Ver empresa
              </Button>
              <Button variant="soft" size="xl" onClick={() => nav("/apoio")}>
                Buscar apoio
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border/60">
          <div className="container py-12 md:py-16 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border/60 text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> 100% anônimo · sem login · sem dados pessoais
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 leading-[1.05]">
              Seu relato. Sua segurança em primeiro lugar.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Não pedimos seu nome. Não rastreamos sua identidade. Seu relato só será visível quando outras mulheres relatarem algo similar.
            </p>
          </div>
        </section>

        <section className="container py-10 max-w-3xl">
          <form onSubmit={onSubmit} className="rounded-3xl bg-card border border-border/60 p-6 md:p-10 shadow-soft space-y-7">
            <div className="space-y-2">
              <Label htmlFor="company">Nome da empresa</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex.: AuroraTech"
                className="h-12"
                list="companies"
                required
              />
              <datalist id="companies">
                {knownCompanies.map((c) => <option key={c.slug} value={c.name} />)}
              </datalist>
              <p className="text-xs text-muted-foreground">
                Empresa nova? Pode digitar livremente — ela será adicionada à plataforma.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Setor</Label>
                <Select value={sector} onValueChange={(v) => setSector(v as Sector)}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de ocorrência</Label>
                <Select value={occurrence} onValueChange={(v) => setOccurrence(v as Occurrence)}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {OCCURRENCES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label>Frequência</Label>
                <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as Frequency)} className="grid grid-cols-2 gap-3">
                  {(["pontual", "recorrente"] as Frequency[]).map((f) => (
                    <label key={f} className={`cursor-pointer rounded-2xl border p-3 text-center text-sm capitalize transition-smooth ${frequency === f ? "border-primary bg-secondary" : "border-border hover:border-primary/40"}`}>
                      <RadioGroupItem value={f} className="sr-only" />
                      {f}
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Nível de gravidade</Label>
                <RadioGroup value={severity} onValueChange={(v) => setSeverity(v as Severity)} className="grid grid-cols-3 gap-2">
                  {([
                    { v: "baixo", label: "Baixo" },
                    { v: "medio", label: "Médio" },
                    { v: "alto", label: "Alto" },
                  ] as { v: Severity; label: string }[]).map((s) => (
                    <label key={s.v} className={`cursor-pointer rounded-2xl border p-3 text-center text-sm transition-smooth ${severity === s.v ? "border-primary bg-secondary" : "border-border hover:border-primary/40"}`}>
                      <RadioGroupItem value={s.v} className="sr-only" />
                      {s.label}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Descrição (opcional)</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte com suas palavras, sem citar nomes próprios. Sua privacidade vem antes de tudo."
                rows={5}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">{description.length}/1000 · evite incluir dados que possam identificar você.</p>
            </div>

            <div className="rounded-2xl bg-gradient-soft border border-border/60 p-4 flex gap-3">
              <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seu relato será agrupado com outros similares. Sua identidade nunca será exposta — nem para nós, nem para a empresa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" variant="petal" size="xl" disabled={!valid} className="flex-1">
                Registrar relato com segurança
              </Button>
              <Button type="button" variant="ghost" size="xl" onClick={() => nav(-1)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}