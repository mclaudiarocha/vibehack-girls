import type { LucideIcon } from "lucide-react";

export const MIN_THRESHOLD = 3;

export type Severity = "baixo" | "medio" | "alto";
export type Frequency = "pontual" | "recorrente";
export type Occurrence =
  | "Assédio moral"
  | "Assédio sexual"
  | "Discriminação de gênero"
  | "Discriminação racial"
  | "Ambiente hostil"
  | "Salário desigual";

export const OCCURRENCES: Occurrence[] = [
  "Assédio moral",
  "Assédio sexual",
  "Discriminação de gênero",
  "Discriminação racial",
  "Ambiente hostil",
  "Salário desigual",
];

export const SECTORS = [
  "Tecnologia",
  "Recursos Humanos",
  "Vendas",
  "Financeiro",
  "Marketing",
  "Operações",
  "Jurídico",
  "Atendimento",
] as const;

export type Sector = (typeof SECTORS)[number];

export interface Report {
  id: string;
  companySlug: string;
  sector: Sector;
  occurrence: Occurrence;
  frequency: Frequency;
  severity: Severity;
  description?: string;
  createdAt: string;
}

export interface Company {
  slug: string;
  name: string;
  industry: string;
  size: string;
}

export const COMPANIES: Company[] = [
  { slug: "auroratech", name: "AuroraTech", industry: "Tecnologia", size: "500–1000 pessoas" },
  { slug: "verdana-cosmeticos", name: "Verdana Cosméticos", industry: "Bens de consumo", size: "200–500 pessoas" },
  { slug: "nimbus-financeira", name: "Nimbus Financeira", industry: "Financeiro", size: "1000+ pessoas" },
  { slug: "ondaviva-mídia", name: "Onda Viva Mídia", industry: "Mídia & Publicidade", size: "100–200 pessoas" },
  { slug: "petalalogistica", name: "Pétala Logística", industry: "Logística", size: "500–1000 pessoas" },
  { slug: "zenitconsultoria", name: "Zênite Consultoria", industry: "Consultoria", size: "50–100 pessoas" },
];

// Seed reports — simulated demo data
const SEED: Omit<Report, "id" | "createdAt">[] = [
  // AuroraTech — risco alto
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Assédio moral", frequency: "recorrente", severity: "medio" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "recorrente", severity: "alto" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "recorrente", severity: "alto" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "medio" },
  { companySlug: "auroratech", sector: "Vendas", occurrence: "Assédio sexual", frequency: "pontual", severity: "alto" },
  { companySlug: "auroratech", sector: "Vendas", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio" },
  // Verdana — atenção
  { companySlug: "verdana-cosmeticos", sector: "Marketing", occurrence: "Ambiente hostil", frequency: "recorrente", severity: "medio" },
  { companySlug: "verdana-cosmeticos", sector: "Marketing", occurrence: "Ambiente hostil", frequency: "pontual", severity: "medio" },
  { companySlug: "verdana-cosmeticos", sector: "Marketing", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo" },
  { companySlug: "verdana-cosmeticos", sector: "Recursos Humanos", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio" },
  // Nimbus — risco
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio" },
  // Onda Viva — atenção
  { companySlug: "ondaviva-mídia", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo" },
  { companySlug: "ondaviva-mídia", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo" },
  { companySlug: "ondaviva-mídia", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "medio" },
  // Pétala Logística — seguro (poucos relatos baixos)
  { companySlug: "petalalogistica", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo" },
  { companySlug: "petalalogistica", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo" },
  { companySlug: "petalalogistica", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo" },
  // Zênite — relato isolado (não exibe padrão)
  { companySlug: "zenitconsultoria", sector: "Jurídico", occurrence: "Assédio moral", frequency: "pontual", severity: "medio" },
];

const STORAGE_KEY = "iris.reports.v1";

function nowMinusDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function seed(): Report[] {
  return SEED.map((r, i) => ({
    ...r,
    id: `seed-${i}`,
    createdAt: nowMinusDays(Math.floor(Math.random() * 150) + 5),
  }));
}

export function loadReports(): Report[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Report[];
  } catch {
    return seed();
  }
}

export function addReport(r: Omit<Report, "id" | "createdAt">): Report {
  const all = loadReports();
  const created: Report = {
    ...r,
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [created, ...all];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return created;
}

// ---------- Aggregations ----------

export interface Pattern {
  occurrence: Occurrence;
  sector: Sector;
  count: number;
  recurrentRatio: number;
  highSeverityRatio: number;
}

export function patternsForCompany(slug: string, reports: Report[]): Pattern[] {
  const own = reports.filter((r) => r.companySlug === slug);
  const groups = new Map<string, Report[]>();
  for (const r of own) {
    const k = `${r.occurrence}__${r.sector}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(r);
  }
  const out: Pattern[] = [];
  for (const [k, list] of groups) {
    if (list.length < MIN_THRESHOLD) continue;
    const [occurrence, sector] = k.split("__") as [Occurrence, Sector];
    out.push({
      occurrence,
      sector,
      count: list.length,
      recurrentRatio: list.filter((r) => r.frequency === "recorrente").length / list.length,
      highSeverityRatio: list.filter((r) => r.severity === "alto").length / list.length,
    });
  }
  return out.sort((a, b) => b.count - a.count);
}

export type ScoreLevel = "seguro" | "atencao" | "risco" | "insuficiente";

export interface CompanyScore {
  level: ScoreLevel;
  score: number; // 0–100, higher = safer
  visibleReports: number;
  totalReports: number;
  patterns: Pattern[];
}

export function scoreForCompany(slug: string, reports: Report[]): CompanyScore {
  const all = reports.filter((r) => r.companySlug === slug);
  const patterns = patternsForCompany(slug, reports);
  const visible = patterns.reduce((s, p) => s + p.count, 0);

  if (visible < MIN_THRESHOLD) {
    return { level: "insuficiente", score: 0, visibleReports: 0, totalReports: all.length, patterns };
  }

  // Penalty: count + severity + recurrence
  let penalty = 0;
  for (const p of patterns) {
    penalty += p.count * 4;
    penalty += p.highSeverityRatio * p.count * 6;
    penalty += p.recurrentRatio * p.count * 4;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));
  let level: ScoreLevel = "seguro";
  if (score < 45) level = "risco";
  else if (score < 72) level = "atencao";
  return { level, score: Math.round(score), visibleReports: visible, totalReports: all.length, patterns };
}

export const LEVEL_LABEL: Record<ScoreLevel, string> = {
  seguro: "Seguro",
  atencao: "Atenção",
  risco: "Risco elevado",
  insuficiente: "Dados insuficientes",
};