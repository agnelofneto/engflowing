export const metadata = { title: "Privacidade — EngFlowing" };

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
        ✦ &nbsp; Privacidade
      </div>
      <h1 className="font-display text-5xl mb-8" style={{ color: "var(--ink-900)" }}>Política de privacidade</h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--ink-800)" }}>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">O que recolhemos</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Dados das submissões (salário, avaliação, etc.) — sem qualquer identificador pessoal</li>
            <li>Cookies técnicos essenciais para o funcionamento do site</li>
            <li><strong>Não</strong> recolhemos IP, email, nem dados de localização</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">Como protegemos a tua identidade</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Submissões agregadas exigem mínimo de 5 entradas por categoria</li>
            <li>Não há registo de utilizadores</li>
            <li>Não usamos rastreadores de terceiros (Google Analytics, Facebook Pixel, etc.)</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">Dados de moderação</h2>
          <p>
            Submissões em fila de moderação podem ser visualizadas pelo administrador
            do site. Após aprovação ou rejeição, são anonimizadas no conjunto público.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-3 mt-6">Os teus direitos (RGPD)</h2>
          <p>
            Por não associarmos as submissões a identidades pessoais, não é possível
            associar uma submissão específica a ti retroativamente. Para questões de
            privacidade, contacta-nos através de email (em breve).
          </p>
        </section>
        <p className="font-sans text-sm italic mt-8" style={{ color: "var(--ink-400)" }}>
          Última atualização: {new Date().toLocaleDateString("pt-PT", { year: "numeric", month: "long" })}.
        </p>
      </div>
    </div>
  );
}
