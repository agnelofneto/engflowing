export const metadata = { title: "Sobre — EngFlowing" };

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
        ✦ &nbsp; A nossa missão
      </div>
      <h1 className="font-display text-5xl mb-8" style={{ color: "var(--ink-900)" }}>Sobre o EngFlowing</h1>
      <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--ink-800)" }}>
        <p>
          O EngFlowing é uma plataforma independente construída por e para engenheiros
          que vivem em Portugal ou querem vir trabalhar para cá.
        </p>
        <p>
          A ideia nasceu da constatação de que decisões importantes —
          aceitar uma proposta, pedir um aumento, mudar de país — são tomadas
          rotineiramente sem informação fiável. Os engenheiros sabem mais uns dos outros do
          que sabem do próprio mercado. Queremos mudar isso.
        </p>
        <p>
          Aqui, salários e avaliações são partilhados de forma anónima. Cada submissão
          é revista manualmente antes de ser publicada — para preservar a qualidade
          e a confiança da comunidade.
        </p>
        <p>
          A plataforma não tem fins lucrativos. Não vendemos os teus dados.
          Não há anúncios. Quando crescer, talvez precisemos de pedir contributos voluntários
          para cobrir custos de infraestrutura — mas o conteúdo será sempre livre de aceder.
        </p>
        <p className="font-sans text-base italic" style={{ color: "var(--ink-600)" }}>
          Conhecimento partilhado entre engenheiros para decisões mais informadas.
        </p>
      </div>
    </div>
  );
}
