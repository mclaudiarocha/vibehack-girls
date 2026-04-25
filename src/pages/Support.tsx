import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, MessageCircle, HeartHandshake, Building2, Scale, ArrowRight } from "lucide-react";

const RESOURCES = [
  {
    icon: Phone,
    title: "Disque 180",
    desc: "Central de Atendimento à Mulher. Gratuito, 24h, sigiloso.",
    action: "tel:180",
    cta: "Ligar agora",
  },
  {
    icon: Phone,
    title: "Disque 190",
    desc: "Polícia Militar — emergência imediata, 24h, gratuito.",
    action: "tel:190",
    cta: "Ligar 190",
  },
  {
    icon: MessageCircle,
    title: "Ligue 180 via WhatsApp",
    desc: "Atendimento por mensagem do Ministério das Mulheres.",
    action: "https://api.whatsapp.com/send?phone=5561996101803",
    cta: "Abrir WhatsApp",
  },
  {
    icon: Scale,
    title: "Defensoria Pública",
    desc: "Apoio jurídico gratuito em casos de assédio e discriminação no trabalho.",
    action: "https://www.gov.br/defensoria/pt-br",
    cta: "Buscar atendimento",
  },
  {
    icon: Building2,
    title: "Ministério Público do Trabalho",
    desc: "Denuncie violações trabalhistas, incluindo assédio moral e sexual.",
    action: "https://mpt.mp.br/",
    cta: "Registrar denúncia",
  },
  {
    icon: HeartHandshake,
    title: "Mapa do Acolhimento",
    desc: "Rede gratuita de psicólogas e advogadas voluntárias.",
    action: "https://www.mapadoacolhimento.org/",
    cta: "Acessar rede",
  },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero border-b border-border/60">
          <div className="container py-14 md:py-20 max-w-3xl">
            <p className="text-sm font-medium text-primary mb-3">Você não está sozinha.</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05]">
              Apoio quando você precisar — no seu tempo, no seu jeito.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Reunimos canais confiáveis e gratuitos. Você não precisa decidir nada agora. Só saber que existem caminhos.
            </p>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map(({ icon: Icon, title, desc, action, cta }) => (
              <a
                key={title}
                href={action}
                target={action.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group rounded-3xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-petal transition-smooth hover:-translate-y-1"
              >
                <div className="h-11 w-11 rounded-2xl bg-gradient-petal flex items-center justify-center mb-5 shadow-soft">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {cta} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-gradient-soft border border-border/60 p-8 md:p-10 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Próximos passos sugeridos</h2>
            <ol className="space-y-3 text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">1.</strong> Registre o que aconteceu por escrito, datas e detalhes — para você, mesmo que não queira denunciar agora.</li>
              <li><strong className="text-foreground">2.</strong> Procure alguém de confiança ou um dos canais acima. Falar reduz o peso.</li>
              <li><strong className="text-foreground">3.</strong> Se quiser ajudar outras mulheres, faça um relato anônimo aqui no Íris. Ele só fica visível quando há padrão — sua identidade está sempre protegida.</li>
            </ol>
            <Link to="/relato" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Fazer relato anônimo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}