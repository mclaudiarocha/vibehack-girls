import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Check,
  Lock,
  Trash2,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import {
  RESOLUTION_LABEL,
  deleteReport,
  loadCompanies,
  updateReport,
  validateReportToken,
  type Report,
  type ResolutionStatus,
} from "@/lib/iris";

export default function MyReport() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const token = params.get("token");
  const nav = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [checked, setChecked] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    const valid = validateReportToken(id, token);
    setReport(valid);
    if (valid?.resolutionNote) setResolutionNote(valid.resolutionNote);
    setChecked(true);
  }, [id, token]);

  const companies = useMemo(() => loadCompanies(), []);
  const company = useMemo(
    () => (report ? companies.find((c) => c.slug === report.companySlug) : undefined),
    [companies, report],
  );

  function markAs(status: ResolutionStatus) {
    if (!report) return;
    const updated = updateReport(report.id, {
      resolution: status,
      resolutionNote: status === "resolvido" ? resolutionNote.trim() || undefined : report.resolutionNote,
    });
    if (updated) {
      setReport(updated);
      toast.success(
        status === "resolvido"
          ? "Denúncia marcada como resolvida."
          : `Status atualizado para “${RESOLUTION_LABEL[status]}”.`,
      );
    }
  }

  function saveNote() {
    if (!report) return;
    const updated = updateReport(report.id, {
      resolutionNote: resolutionNote.trim() || undefined,
    });
    if (updated) {
      setReport(updated);
      toast.success("Texto atualizado.");
    }
  }

  function onDelete() {
    if (!report) return;
    deleteReport(report.id);
    toast.success("Denúncia excluída.");
    nav("/empresas");
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container py-20 max-w-xl" />
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container py-20 max-w-xl">
          <div className="rounded-3xl bg-card border border-border/60 p-8 md:p-10 text-center shadow-soft">
            <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
              <Lock className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="font-display text-3xl font-semibold mb-2">Acesso inválido</h1>
            <p className="text-muted-foreground leading-relaxed">
              O link usado é inválido, foi alterado ou a denúncia não existe mais.
              Por segurança, nenhuma ação pode ser executada sem um token válido.
            </p>
            <Button asChild variant="petal" size="xl" className="mt-7">
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isResolved = report.resolution === "resolvido";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border/60">
          <div className="container py-12 md:py-14 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border/60 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Acesso autenticado por link · 100% anônimo
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 leading-[1.05]">
              Sua denúncia
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Apenas você tem este link. Aqui você pode acompanhar, atualizar ou excluir sua denúncia.
            </p>
          </div>
        </section>

        <section className="container py-10 max-w-3xl space-y-6">
          {/* Dados da denúncia */}
          <article className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-soft">
            <header className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  {company?.name ?? report.companySlug}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(report.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                  isResolved
                    ? "bg-safe/10 border-safe/30 text-safe"
                    : report.resolution === "em_andamento"
                      ? "bg-warn/10 border-warn/30 text-warn-foreground"
                      : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {RESOLUTION_LABEL[report.resolution]}
              </span>
            </header>

            <dl className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Setor</dt>
                <dd className="mt-0.5 font-medium">{report.sector}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Ocorrência</dt>
                <dd className="mt-0.5 font-medium">{report.occurrence}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Frequência</dt>
                <dd className="mt-0.5 font-medium capitalize">{report.frequency}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Gravidade</dt>
                <dd className="mt-0.5 font-medium capitalize">{report.severity}</dd>
              </div>
            </dl>

            {report.description && (
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
                  Descrição (Anônimo)
                </h3>
                <p className="text-sm leading-relaxed bg-muted/40 border border-border/60 rounded-2xl p-4">
                  {report.description}
                </p>
              </div>
            )}
          </article>

          {/* Marcar como resolvido */}
          {!isResolved ? (
            <article className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-soft space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-safe/10 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-safe" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Marcar como resolvido</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Atualize o status quando o problema for tratado pela empresa.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">
                  Deseja compartilhar como o problema foi resolvido? <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Textarea
                  id="note"
                  rows={4}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Ex.: A empresa abriu um canal de denúncias e iniciou treinamento da liderança."
                  maxLength={600}
                />
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-warn-foreground" />
                  Evite incluir informações que possam te identificar. Este texto será exibido publicamente junto ao status “Resolvido”.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="petal"
                  size="xl"
                  className="flex-1"
                  onClick={() => markAs("resolvido")}
                >
                  Marcar como resolvido
                </Button>
                {report.resolution !== "em_andamento" && (
                  <Button variant="soft" size="xl" onClick={() => markAs("em_andamento")}>
                    Marcar “Em andamento”
                  </Button>
                )}
              </div>
            </article>
          ) : (
            <article className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-soft space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-safe/10 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-safe" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Denúncia resolvida</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você pode atualizar ou adicionar como o problema foi resolvido.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Como o problema foi resolvido (opcional)</Label>
                <Textarea
                  id="note"
                  rows={4}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  maxLength={600}
                />
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-warn-foreground" />
                  Evite incluir informações que possam te identificar.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="petal" size="xl" className="flex-1" onClick={saveNote}>
                  Salvar texto
                </Button>
                <Button variant="soft" size="xl" onClick={() => markAs("nao_resolvido")}>
                  Reabrir denúncia
                </Button>
              </div>
            </article>
          )}

          {/* Excluir */}
          <article className="rounded-3xl bg-card border border-destructive/30 p-6 md:p-8 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold">Excluir denúncia</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta ação é permanente e não pode ser desfeita. O link mágico deixará de funcionar.
                </p>
                {!confirmDelete ? (
                  <Button
                    variant="outline"
                    className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Excluir minha denúncia
                  </Button>
                ) : (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Button variant="destructive" onClick={onDelete}>
                      Sim, excluir definitivamente
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </article>

          <p className="text-xs text-muted-foreground text-center pt-2">
            🕶️ Sua identidade nunca é exibida. Todas as denúncias e comentários aparecem como “Anônimo”.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}