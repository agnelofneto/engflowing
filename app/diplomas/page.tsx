import Link from "next/link";

export const metadata = { title: "Validar diploma em Portugal — EngFlowing" };

export default function DiplomasPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
          ✦ &nbsp; Guia prático
        </div>
        <h1 className="font-display text-5xl mb-5 leading-tight" style={{ color: "var(--ink-900)" }}>
          Validar o teu diploma em Portugal
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--ink-600)" }}>
          O reconhecimento do grau académico estrangeiro é o primeiro passo para exercer
          engenharia em Portugal — antes da inscrição na Ordem, antes do visto de
          trabalho, antes de tudo.
        </p>
      </div>

      <section className="mb-10">
        <div className="grid gap-5" style={{ gridTemplateColumns: "44px 1fr" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-medium" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>1</div>
          <div>
            <h2 className="font-display text-2xl mb-3" style={{ color: "var(--ink-900)" }}>
              Reconhecimento do curso junto à DGES
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--ink-600)" }}>
              A <strong>Direção-Geral do Ensino Superior</strong> é a entidade oficial responsável
              pelo reconhecimento de graus académicos estrangeiros em Portugal. Existem dois tipos
              de reconhecimento — escolhe o que melhor se adequa à tua situação:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded" style={{ background: "rgba(92,122,91,0.08)", borderLeft: "3px solid var(--sage)" }}>
                <p className="font-sans text-xs uppercase tracking-wider mb-1" style={{ color: "var(--sage)" }}>Opção mais rápida</p>
                <p className="font-display text-lg leading-snug mb-2" style={{ color: "var(--ink-900)" }}>Reconhecimento de nível</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-700)" }}>
                  Processo mais simples e rápido. Reconhece que o teu grau corresponde a um
                  nível académico português equivalente (licenciatura, mestrado).
                </p>
              </div>
              <div className="p-4 rounded" style={{ background: "rgba(200,128,26,0.08)", borderLeft: "3px solid var(--amber-accent)" }}>
                <p className="font-sans text-xs uppercase tracking-wider mb-1" style={{ color: "var(--amber-deep)" }}>Mais detalhado</p>
                <p className="font-display text-lg leading-snug mb-2" style={{ color: "var(--ink-900)" }}>Reconhecimento específico</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-700)" }}>
                  Equipara o teu curso a um curso português específico. Mais demorado mas exigido
                  em algumas situações profissionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="grid gap-5" style={{ gridTemplateColumns: "44px 1fr" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-medium" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>2</div>
          <div>
            <h2 className="font-display text-2xl mb-3" style={{ color: "var(--ink-900)" }}>
              Reunir a documentação
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--ink-600)" }}>
              Antes de submeter o pedido, organiza estes documentos:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-3 items-start">
                <span className="font-display text-xl leading-none mt-1" style={{ color: "var(--amber-accent)" }}>·</span>
                <div>
                  <p className="font-sans text-base" style={{ color: "var(--ink-900)" }}>
                    <strong>Diploma de graduação</strong> — original ou cópia certificada
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-display text-xl leading-none mt-1" style={{ color: "var(--amber-accent)" }}>·</span>
                <div>
                  <p className="font-sans text-base" style={{ color: "var(--ink-900)" }}>
                    <strong>Histórico escolar completo</strong> — com todas as disciplinas e notas
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-display text-xl leading-none mt-1" style={{ color: "var(--amber-accent)" }}>·</span>
                <div>
                  <p className="font-sans text-base" style={{ color: "var(--ink-900)" }}>
                    <strong>Ementas das disciplinas</strong>
                    <span className="italic" style={{ color: "var(--ink-600)" }}> — apenas para reconhecimento específico</span>
                  </p>
                </div>
              </li>
            </ul>
            <div className="p-4 rounded mt-5" style={{ background: "rgba(200,128,26,0.1)", borderLeft: "3px solid var(--amber-accent)" }}>
              <p className="font-sans text-xs uppercase tracking-wider mb-2" style={{ color: "var(--amber-deep)" }}>⚠️ Crítico</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-800)" }}>
                <strong>Todos os documentos têm de ter Apostila de Haia.</strong> Sem isto, a DGES
                não aceita o pedido. A apostila é emitida no país de origem do diploma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="p-6 rounded" style={{ background: "rgba(200,128,26,0.06)", borderLeft: "3px solid var(--amber-deep)" }}>
          <p className="font-sans text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "var(--amber-deep)" }}>Resumo prático</p>
          <p className="text-base leading-relaxed" style={{ color: "var(--ink-800)" }}>
            O primeiro passo é o <strong>reconhecimento do grau pela DGES</strong>. Sem isto,
            nenhum outro passo (Ordem dos Engenheiros, visto D1, contrato de trabalho) pode
            prosseguir. Começa por aqui.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="pt-6 border-t" style={{ borderColor: "var(--ink-200)" }}>
          <p className="font-sans text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "var(--ink-400)" }}>Link oficial</p>
          <a href="https://www.dges.gov.pt/pt/pagina/reconhecimento" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 font-sans text-sm hover:opacity-90 transition" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
            Iniciar processo na DGES ↗
          </a>
          <p className="font-sans text-xs italic mt-3" style={{ color: "var(--ink-400)" }}>dges.gov.pt/pt/pagina/reconhecimento</p>
        </div>
      </section>

      <section className="mb-10">
        <div className="pt-6 border-t" style={{ borderColor: "var(--ink-200)" }}>
          <p className="font-sans text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "var(--ink-400)" }}>
            Próximas etapas <span className="italic normal-case tracking-normal" style={{ letterSpacing: "0" }}>(artigos a publicar em breve)</span>
          </p>
          <ul className="space-y-2 font-sans text-sm" style={{ color: "var(--ink-600)" }}>
            <li>→ Inscrição na Ordem dos Engenheiros</li>
            <li>→ Visto D1 (trabalho) e Visto D7 (residência)</li>
            <li>→ Tradução juramentada e onde fazer Apostila de Haia</li>
            <li>→ NIF, abertura de conta bancária e morada fiscal</li>
            <li>→ Inscrição na Segurança Social e no IRS</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <div className="card-paper p-8 text-center" style={{ background: "rgba(247,245,240,0.7)" }}>
          <p className="font-display text-2xl mb-3 leading-snug" style={{ color: "var(--ink-900)" }}>
            Já passaste por este processo?
          </p>
          <p className="font-sans text-sm mb-6" style={{ color: "var(--ink-600)" }}>
            A tua experiência ajuda outros engenheiros a evitar erros e a poupar meses.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/avaliar-empresa" className="px-5 py-3 font-sans text-sm border hover:bg-white/40 transition" style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}>
              Avaliar uma empresa
            </Link>
            <Link href="/submeter-salario" className="px-5 py-3 font-sans text-sm hover:opacity-90 transition" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
              Partilhar o meu salário →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
