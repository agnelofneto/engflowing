export const metadata = { title: "Termos de uso — EngFlowing" };

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
        ✦ &nbsp; Termos de uso
      </div>
      <h1 className="font-display text-5xl mb-8" style={{ color: "var(--ink-900)" }}>Termos de uso</h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--ink-800)" }}>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">1. Natureza da plataforma</h2>
          <p>
            O EngFlowing é uma plataforma de partilha de informação salarial e
            avaliação de empresas, mantida por uma iniciativa independente. O conteúdo
            é submetido por utilizadores anónimos.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">2. Submissões</h2>
          <p>
            Ao submeter informação, declaras que os dados são verídicos e refletem
            a tua experiência pessoal. Submissões fraudulentas, duplicadas ou maliciosas
            serão removidas sem aviso.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">3. Avaliações de empresas</h2>
          <p>
            Avaliações devem ser factuais e basear-se em experiência direta. É expressamente
            proibido:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Identificar pessoas pelo nome (colegas, chefias, etc.)</li>
            <li>Difamar a empresa ou os seus colaboradores</li>
            <li>Publicar informação confidencial ou protegida por NDA</li>
          </ul>
          <p className="mt-3">
            Empresas avaliadas podem solicitar a remoção de avaliações que considerem
            falsas ou difamatórias. Cada caso é analisado individualmente.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">4. Moderação</h2>
          <p>
            Todas as submissões passam por revisão manual antes de publicação.
            Reservamos o direito de rejeitar conteúdo sem justificação prévia.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">5. Responsabilidade</h2>
          <p>
            O conteúdo desta plataforma é fornecido "tal como está", sem garantias de
            exatidão. Decisões profissionais com base na informação aqui partilhada são
            da exclusiva responsabilidade do utilizador.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">6. Alterações</h2>
          <p>
            Estes termos podem ser atualizados. A versão em vigor é sempre a publicada nesta página.
          </p>
        </section>
        <p className="font-sans text-sm italic mt-8" style={{ color: "var(--ink-400)" }}>
          Última atualização: {new Date().toLocaleDateString("pt-PT", { year: "numeric", month: "long" })}.
        </p>
      </div>
    </div>
  );
}
