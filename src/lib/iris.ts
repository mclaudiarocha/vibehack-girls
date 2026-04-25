export const MIN_THRESHOLD = 3;

export type Severity = "baixo" | "medio" | "alto";
export type Frequency = "pontual" | "recorrente";
export type ResolutionStatus = "nao_resolvido" | "em_andamento" | "resolvido";

export const RESOLUTION_LABEL: Record<ResolutionStatus, string> = {
  nao_resolvido: "Não resolvido",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
};

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
  resolution: ResolutionStatus;
  description?: string;
  createdAt: string;
  // Anonimato preservado: nunca expor email no frontend.
  // Apenas o flag verified é derivado no momento do registro.
  verified?: boolean;
  // Campos opcionais para ex-funcionárias (contexto, sem identificação)
  workedYear?: number;
  workedArea?: string;
  tenure?: string;
}

export interface Company {
  slug: string;
  name: string;
  industry: string;
  size: string;
}

const SEED_COMPANIES: Company[] = [
  { slug: "auroratech", name: "AuroraTech", industry: "Tecnologia", size: "500–1000 pessoas" },
  { slug: "verdana-cosmeticos", name: "Verdana Cosméticos", industry: "Bens de consumo", size: "200–500 pessoas" },
  { slug: "nimbus-financeira", name: "Nimbus Financeira", industry: "Financeiro", size: "1000+ pessoas" },
  { slug: "ondaviva-midia", name: "Onda Viva Mídia", industry: "Mídia & Publicidade", size: "100–200 pessoas" },
  { slug: "petalalogistica", name: "Pétala Logística", industry: "Logística", size: "500–1000 pessoas" },
  { slug: "zenitconsultoria", name: "Zênite Consultoria", industry: "Consultoria", size: "50–100 pessoas" },
  { slug: "ifood", name: "iFood", industry: "Tecnologia", size: "1000+ pessoas" },
  { slug: "google", name: "Google", industry: "Tecnologia", size: "1000+ pessoas" },
  { slug: "ambev", name: "Ambev", industry: "Bens de consumo", size: "1000+ pessoas" },
  { slug: "accenture", name: "Accenture", industry: "Consultoria", size: "1000+ pessoas" },
  { slug: "apple", name: "Apple", industry: "Tecnologia", size: "1000+ pessoas" },
  { slug: "localiza", name: "Localiza", industry: "Mobilidade", size: "1000+ pessoas" },
  { slug: "samsung", name: "Samsung", industry: "Tecnologia", size: "1000+ pessoas" },
  { slug: "microsoft", name: "Microsoft", industry: "Tecnologia", size: "1000+ pessoas" },
];

const COMPANIES_KEY = "iris.companies.v1";
const STORAGE_KEY = "iris.reports.v2";

export function loadCompanies(): Company[] {
  if (typeof window === "undefined") return SEED_COMPANIES;
  try {
    const raw = localStorage.getItem(COMPANIES_KEY);
    if (!raw) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(SEED_COMPANIES));
      return SEED_COMPANIES;
    }
    const stored = JSON.parse(raw) as Company[];
    // Merge: ensure all seed companies exist
    const slugs = new Set(stored.map((c) => c.slug));
    const merged = [...stored];
    for (const c of SEED_COMPANIES) {
      if (!slugs.has(c.slug)) merged.push(c);
    }
    if (merged.length !== stored.length) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return SEED_COMPANIES;
  }
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ensureCompany(name: string): Company {
  const trimmed = name.trim();
  const all = loadCompanies();
  const existing = all.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;
  const created: Company = {
    slug: slugify(trimmed) || `empresa-${Date.now()}`,
    name: trimmed,
    industry: "Não informado",
    size: "Não informado",
  };
  const next = [...all, created];
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(next));
  return created;
}

// Backwards-compatible export (some pages may still import COMPANIES)
export const COMPANIES: Company[] = SEED_COMPANIES;

// Seed reports — simulated demo data
const SEED: Omit<Report, "id" | "createdAt">[] = [
  // AuroraTech — risco alto, baixa resolução
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido", description: "Comentários humilhantes em reuniões públicas, sem ação da liderança." },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido", description: "Gestor faz piadas constantes sobre desempenho de mulheres do time." },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Assédio moral", frequency: "recorrente", severity: "medio", resolution: "em_andamento" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido", description: "Promoções sempre vão para homens, mesmo com desempenho inferior." },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido" },
  { companySlug: "auroratech", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "medio", resolution: "em_andamento" },
  { companySlug: "auroratech", sector: "Vendas", occurrence: "Assédio sexual", frequency: "pontual", severity: "alto", resolution: "nao_resolvido", description: "Convites insistentes para encontros fora do trabalho, ignorados pela área de pessoas." },
  { companySlug: "auroratech", sector: "Vendas", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio", resolution: "nao_resolvido" },
  // Verdana — atenção, alguns resolvidos
  { companySlug: "verdana-cosmeticos", sector: "Marketing", occurrence: "Ambiente hostil", frequency: "recorrente", severity: "medio", resolution: "resolvido", description: "Após relato coletivo, gestor foi afastado e houve treinamento." },
  { companySlug: "verdana-cosmeticos", sector: "Marketing", occurrence: "Ambiente hostil", frequency: "pontual", severity: "medio", resolution: "resolvido" },
  { companySlug: "verdana-cosmeticos", sector: "Marketing", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "em_andamento" },
  { companySlug: "verdana-cosmeticos", sector: "Recursos Humanos", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio", resolution: "em_andamento" },
  // Nimbus — risco, resolução baixa
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido", description: "Cobranças agressivas e ameaças veladas de demissão." },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "em_andamento" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio", resolution: "nao_resolvido" },
  { companySlug: "nimbus-financeira", sector: "Financeiro", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio", resolution: "nao_resolvido" },
  // Onda Viva — atenção
  { companySlug: "ondaviva-midia", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "ondaviva-midia", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "em_andamento" },
  { companySlug: "ondaviva-midia", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "medio", resolution: "nao_resolvido" },
  // Pétala Logística — segura porque resolve
  { companySlug: "petalalogistica", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido", description: "Empresa abriu canal direto com RH e implementou comitê de diversidade." },
  { companySlug: "petalalogistica", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "petalalogistica", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  // Zênite — relato isolado
  { companySlug: "zenitconsultoria", sector: "Jurídico", occurrence: "Assédio moral", frequency: "pontual", severity: "medio", resolution: "em_andamento" },

  // ===== Demo: empresas conhecidas =====
  // iFood — atenção, alguns resolvidos
  { companySlug: "ifood", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "recorrente", severity: "medio", resolution: "em_andamento", description: "Pressão excessiva por entregas e cultura de cobrança hostil em squads." },
  { companySlug: "ifood", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "recorrente", severity: "medio", resolution: "resolvido" },
  { companySlug: "ifood", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "ifood", sector: "Operações", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "medio", resolution: "em_andamento", description: "Mulheres em posições de liderança ainda enfrentam resistência em decisões." },
  // Google — segura, alta resolução
  { companySlug: "google", sector: "Tecnologia", occurrence: "Salário desigual", frequency: "pontual", severity: "medio", resolution: "resolvido", description: "Após auditoria interna, salários foram revisados e equiparados." },
  { companySlug: "google", sector: "Tecnologia", occurrence: "Salário desigual", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "google", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "google", sector: "Marketing", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  // Ambev — risco
  { companySlug: "ambev", sector: "Vendas", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido", description: "Cultura comercial extremamente agressiva, gestores humilham equipe em metas." },
  { companySlug: "ambev", sector: "Vendas", occurrence: "Assédio moral", frequency: "recorrente", severity: "alto", resolution: "nao_resolvido" },
  { companySlug: "ambev", sector: "Vendas", occurrence: "Assédio sexual", frequency: "pontual", severity: "alto", resolution: "em_andamento", description: "Eventos comerciais com bebida levam a situações constrangedoras sem apuração séria." },
  { companySlug: "ambev", sector: "Operações", occurrence: "Discriminação de gênero", frequency: "recorrente", severity: "medio", resolution: "nao_resolvido" },
  // Accenture — atenção
  { companySlug: "accenture", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "recorrente", severity: "medio", resolution: "em_andamento", description: "Sobrecarga em projetos e pouco suporte emocional para times remotos." },
  { companySlug: "accenture", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "pontual", severity: "medio", resolution: "resolvido" },
  { companySlug: "accenture", sector: "Tecnologia", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio", resolution: "em_andamento" },
  // Apple — segura
  { companySlug: "apple", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido", description: "Conflito interpessoal pontual resolvido com mediação rápida." },
  { companySlug: "apple", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "apple", sector: "Marketing", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  // Localiza — atenção
  { companySlug: "localiza", sector: "Atendimento", occurrence: "Ambiente hostil", frequency: "recorrente", severity: "medio", resolution: "em_andamento" },
  { companySlug: "localiza", sector: "Atendimento", occurrence: "Ambiente hostil", frequency: "pontual", severity: "medio", resolution: "nao_resolvido", description: "Clientes agressivos sem apoio adequado da liderança." },
  { companySlug: "localiza", sector: "Vendas", occurrence: "Salário desigual", frequency: "recorrente", severity: "medio", resolution: "em_andamento" },
  // Samsung — atenção
  { companySlug: "samsung", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "recorrente", severity: "medio", resolution: "em_andamento", description: "Decisões técnicas frequentemente ignoram opiniões de engenheiras." },
  { companySlug: "samsung", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "medio", resolution: "resolvido" },
  { companySlug: "samsung", sector: "Operações", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "em_andamento" },
  // Microsoft — segura
  { companySlug: "microsoft", sector: "Tecnologia", occurrence: "Ambiente hostil", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
  { companySlug: "microsoft", sector: "Tecnologia", occurrence: "Salário desigual", frequency: "pontual", severity: "baixo", resolution: "resolvido", description: "Programa de equidade salarial revisa contratações anualmente." },
  { companySlug: "microsoft", sector: "Tecnologia", occurrence: "Discriminação de gênero", frequency: "pontual", severity: "baixo", resolution: "resolvido" },
];

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
  resolvedRatio: number;
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
      resolvedRatio: list.filter((r) => r.resolution === "resolvido").length / list.length,
    });
  }
  return out.sort((a, b) => b.count - a.count);
}

// All occurrences (grouped, not filtered by threshold) — for full transparency listing
export interface OccurrenceGroup {
  occurrence: Occurrence;
  sector: Sector;
  count: number;
  recurrent: number;
  high: number;
  resolved: number;
  inProgress: number;
  unresolved: number;
}

export function allOccurrencesForCompany(slug: string, reports: Report[]): OccurrenceGroup[] {
  const own = reports.filter((r) => r.companySlug === slug);
  const groups = new Map<string, Report[]>();
  for (const r of own) {
    const k = `${r.occurrence}__${r.sector}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(r);
  }
  const out: OccurrenceGroup[] = [];
  for (const [k, list] of groups) {
    const [occurrence, sector] = k.split("__") as [Occurrence, Sector];
    out.push({
      occurrence,
      sector,
      count: list.length,
      recurrent: list.filter((r) => r.frequency === "recorrente").length,
      high: list.filter((r) => r.severity === "alto").length,
      resolved: list.filter((r) => r.resolution === "resolvido").length,
      inProgress: list.filter((r) => r.resolution === "em_andamento").length,
      unresolved: list.filter((r) => r.resolution === "nao_resolvido").length,
    });
  }
  return out.sort((a, b) => b.count - a.count);
}

export function commentsForCompany(slug: string, reports: Report[]): Report[] {
  return reports
    .filter((r) => r.companySlug === slug && r.description && r.description.trim().length > 0)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function resolutionRateForCompany(slug: string, reports: Report[]): number {
  const own = reports.filter((r) => r.companySlug === slug);
  if (own.length === 0) return 0;
  return own.filter((r) => r.resolution === "resolvido").length / own.length;
}

export type ScoreLevel = "seguro" | "atencao" | "risco" | "insuficiente";

export interface CompanyScore {
  level: ScoreLevel;
  score: number; // 0–100, higher = safer
  visibleReports: number;
  totalReports: number;
  resolutionRate: number; // 0–1
  patterns: Pattern[];
  /** Nível de Segurança — métrica única. 0–100, MAIOR = mais arriscado. */
  riskScore: number;
  /** Selo "Great Place to Work" — concedido a empresas consistentemente seguras. */
  trustSeal: boolean;
  verifiedReports: number;
}

export function scoreForCompany(slug: string, reports: Report[]): CompanyScore {
  const all = reports.filter((r) => r.companySlug === slug);
  const patterns = patternsForCompany(slug, reports);
  const visible = patterns.reduce((s, p) => s + p.count, 0);
  const resolutionRate = resolutionRateForCompany(slug, reports);
  const verifiedReports = all.filter((r) => r.verified).length;

  if (all.length < MIN_THRESHOLD) {
    return {
      level: "insuficiente",
      score: 0,
      visibleReports: visible,
      totalReports: all.length,
      resolutionRate,
      patterns,
      riskScore: 0,
      trustSeal: false,
      verifiedReports,
    };
  }

  // Penalty: based on volume + severity + recurrence (across ALL reports, not just visible patterns)
  let penalty = 0;
  const totalCount = all.length;
  const highRatio = all.filter((r) => r.severity === "alto").length / totalCount;
  const recurrentRatio = all.filter((r) => r.frequency === "recorrente").length / totalCount;
  penalty += Math.min(50, totalCount * 3); // volume
  penalty += highRatio * totalCount * 4;   // severity
  penalty += recurrentRatio * totalCount * 3; // recurrence

  // Resolution bonus: resolving issues recovers up to 60 points
  const resolutionBonus = resolutionRate * 60;

  const score = Math.max(0, Math.min(100, 100 - penalty + resolutionBonus));

  // ===== Nível de Segurança (métrica única) =====
  // Escala: 0–100, MAIOR = mais arriscado.
  // Pesos: relato verificado = 2, não verificado = 1.
  // Combina volume ponderado, gravidade, recorrência e (inversa) taxa de resolução.
  const weighted = all.reduce((s, r) => s + (r.verified ? 2 : 1), 0);
  const sevScore = all.reduce(
    (s, r) => s + (r.severity === "alto" ? 3 : r.severity === "medio" ? 1.5 : 0.5) * (r.verified ? 2 : 1),
    0
  );
  const recScore = all.reduce(
    (s, r) => s + (r.frequency === "recorrente" ? 1.5 : 0.5) * (r.verified ? 2 : 1),
    0
  );
  // Componentes normalizados (cada um contribui até ~33 pontos antes de ajuste)
  const volumeComp = Math.min(35, weighted * 1.6);
  const severityComp = Math.min(35, sevScore * 1.2);
  const recurrenceComp = Math.min(20, recScore * 0.9);
  const rawRisk = volumeComp + severityComp + recurrenceComp;
  // Resolução reduz o risco em até 40%
  const resolutionRelief = rawRisk * resolutionRate * 0.5;
  const riskScore = Math.max(0, Math.min(100, Math.round(rawRisk - resolutionRelief)));

  // Classificação única baseada no Nível de Segurança
  let level: ScoreLevel;
  if (riskScore <= 30) level = "seguro";
  else if (riskScore <= 50) level = "atencao";
  else level = "risco";

  // Selo "Great Place to Work" — consistência de segurança:
  // - Classificada como segura
  // - Resolução alta (>=70%)
  // - Volume mínimo de relatos verificados (sinal de presença real, não ausência de dados)
  // - Sem padrão dominante de gravidade alta
  const verifiedShare = verifiedReports / totalCount;
  const trustSeal =
    level === "seguro" &&
    resolutionRate >= 0.7 &&
    totalCount >= 4 &&
    verifiedShare >= 0.3 &&
    highRatio <= 0.15;

  return {
    level,
    score: Math.round(score),
    visibleReports: visible,
    totalReports: all.length,
    resolutionRate,
    patterns,
    riskScore,
    trustSeal,
    verifiedReports,
  };
}

export const LEVEL_LABEL: Record<ScoreLevel, string> = {
  seguro: "Seguro",
  atencao: "Atenção",
  risco: "Risco elevado",
  insuficiente: "Dados insuficientes",
};
