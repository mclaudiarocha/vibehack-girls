// Sistema de autenticação leve (client-side, demo).
// O email NUNCA é exibido na interface nem associado publicamente a relatos.
// Apenas usado localmente para derivar o flag "verified" no momento do registro.

const SESSION_KEY = "iris.session.v1";

const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "ig.com.br",
  "zoho.com",
  "aol.com",
]);

export interface IrisSession {
  /** ID interno opaco — nunca expõe o email. */
  id: string;
  /** Domínio do email (usado só para verificação contra a empresa). */
  domain: string;
  /** True se o domínio NÃO é de provedor pessoal. */
  corporate: boolean;
  createdAt: string;
}

export function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 0) return "";
  return email.slice(at + 1).trim().toLowerCase();
}

export function isCorporateEmail(email: string): boolean {
  const d = emailDomain(email);
  if (!d || !d.includes(".")) return false;
  return !PERSONAL_DOMAINS.has(d);
}

function hashId(input: string): string {
  // Hash simples (FNV-1a) só para gerar um ID opaco. Não criptográfico.
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return `u_${h.toString(36)}`;
}

export function getSession(): IrisSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as IrisSession) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string): IrisSession {
  const domain = emailDomain(email);
  const session: IrisSession = {
    id: hashId(email.trim().toLowerCase()),
    domain,
    corporate: isCorporateEmail(email),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Disparar evento para componentes ouvirem
  window.dispatchEvent(new Event("iris:auth"));
  return session;
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("iris:auth"));
}

/** Normaliza nome de empresa em tokens para checagem heurística contra o domínio. */
function nameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);
}

/**
 * Heurística: o domínio do email corresponde à empresa relatada?
 * Ex.: maria@google.com + empresa "Google" -> true.
 */
export function domainMatchesCompany(domain: string, companyName: string): boolean {
  if (!domain) return false;
  const dCore = domain.split(".")[0]; // "google" de "google.com"
  const tokens = nameTokens(companyName);
  if (tokens.includes(dCore)) return true;
  // checagem reversa: nome contém o core do domínio ou vice-versa
  return tokens.some((t) => dCore.includes(t) || t.includes(dCore));
}

/**
 * Decide se um relato deve ser marcado como verificado.
 * Regra: email corporativo COM domínio que corresponde à empresa relatada.
 */
export function shouldVerifyReport(session: IrisSession | null, companyName: string): boolean {
  if (!session) return false;
  if (!session.corporate) return false;
  return domainMatchesCompany(session.domain, companyName);
}