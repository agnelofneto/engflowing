import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CompanyAgg {
  empresa: string;
  setor: string;
  localizacao: string;
  total: number;
  media_geral: number;
  media_salario: number;
  media_ambiente: number;
  media_crescimento: number;
  media_lideranca: number;
  media_equilibrio: number;
  ultima_avaliacao: any;
  pontos_positivos: string[];
  pontos_negativos: string[];
}

// Extrair frases curtas dos comentários (separadas por vírgula ou ponto)
function extractKeyPhrases(texts: string[]): { phrase: string; count: number }[] {
  const phrases: Record<string, number> = {};
  texts.forEach((t) => {
    if (!t) return;
    const parts = t.split(/[.,;]/).map((p) => p.trim().toLowerCase()).filter((p) => p.length > 3 && p.length < 60);
    parts.forEach((p) => {
      const cap = p.charAt(0).toUpperCase() + p.slice(1);
      phrases[cap] = (phrases[cap] || 0) + 1;
    });
  });
  return Object.entries(phrases)
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export default async function EmpresasPage() {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  const groups: Record<string, any> = {};
  (data ?? []).forEach((r: any) => {
    const key = r.empresa_nome;
    if (!groups[key]) {
      groups[key] = {
        empresa: r.empresa_nome,
        setor: r.setor,
        localizacao: r.localizacao,
        ratings: { salario: [], ambiente: [], crescimento: [], lideranca: [], equilibrio: [] },
        positivos: [],
        negativos: [],
        ultima: r,
      };
    }
    groups[key].ratings.salario.push(r.rating_salario);
    groups[key].ratings.ambiente.push(r.rating_ambiente);
    groups[key].ratings.crescimento.push(r.rating_crescimento);
    groups[key].ratings.lideranca.push(r.rating_lideranca);
    groups[key].ratings.equilibrio.push(r.rating_equilibrio);
    if (r.pontos_positivos) groups[key].positivos.push(r.pontos_positivos);
    if (r.pontos_negativos) groups[key].negativos.push(r.pontos_negativos);
  });

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const companies: CompanyAgg[] = Object.values(groups)
    .map((g: any) => {
      const ms = avg(g.ratings.salario);
      const ma = avg(g.ratings.ambiente);
      const mc = avg(g.ratings.crescimento);
      const ml = avg(g.ratings.lideranca);
      const me = avg(g.ratings.equilibrio);
      const top_positivos = extractKeyPhrases(g.positivos);
      const top_negativos = extractKeyPhrases(g.negativos);
      return {
        empresa: g.empresa,
        setor: g.setor,
        localizacao: g.localizacao,
        total: g.ratings.salario.length,
        media_salario: ms,
        media_ambiente: ma,
        media_crescimento: mc,
        media_lideranca: ml,
        media_equilibrio: me,
        media_geral: (ms + ma + mc + ml + me) / 5,
        ultima_avaliacao: g.ultima,
        pontos_positivos: top_positivos.map((p) => `${p.phrase} (${p.count}×)`),
        pontos_negativos: top_negativos.map((p) => `${p.phrase} (${p.count}×)`),
      };
    })
    .sort((a, b) => b.media_geral - a.media_geral);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-sans text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "var(--amber-accent)" }}>
            ✦ &nbsp; Ranking de empresas
          </div>
          <h1 className="font-display text-5xl mb-3" style={{ color: "var(--ink-900)" }}>
            Empresas avaliadas pela comunidade
          </h1>
          <p className="text-lg" style={{ color: "var(--ink-600)" }}>
            {companies.length} {companies.length === 1 ? "empresa avaliada" : "empresas avaliadas"}
          </p>
        </div>
        <Link href="/avaliar-empresa" className="px-6 py-3 font-sans text-sm" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
          Avaliar empresa →
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="card-paper p-16 text-center">
          <p className="font-display text-2xl mb-4" style={{ color: "var(--ink-600)" }}>
            Ainda não há empresas avaliadas.
          </p>
          <Link href="/avaliar-empresa" className="inline-block mt-4 px-6 py-3 font-sans text-sm" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
            Sê o primeiro a avaliar →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((c, i) => {
            const categorias = [
              { label: "Salário", val: c.media_salario },
              { label: "Ambiente", val: c.media_ambiente },
              { label: "Crescimento", val: c.media_crescimento },
              { label: "Liderança", val: c.media_lideranca },
              { label: "Equilíbrio", val: c.media_equilibrio },
            ];
            const ultima = c.ultima_avaliacao;
            return (
              <div key={i} className="card-paper p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-start gap-4 mb-4 flex-wrap">
                  <div>
                    <h3 className="font-display text-2xl leading-tight" style={{ color: "var(--ink-900)" }}>{c.empresa}</h3>
                    <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-400)" }}>
                      {c.setor} · {c.localizacao} · <strong>{c.total} {c.total === 1 ? "avaliação" : "avaliações"}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1.5 font-display text-xl tabular-nums" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
                      {c.media_geral.toFixed(1)} ★
                    </div>
                    <p className="font-sans text-[10px] uppercase tracking-wider mt-1" style={{ color: "var(--ink-400)" }}>
                      Média global
                    </p>
                  </div>
                </div>

                {/* Barras por categoria */}
                <div className="mb-4 space-y-1.5">
                  {categorias.map((cat, j) => (
                    <div key={j} className="grid items-center gap-3" style={{ gridTemplateColumns: "100px 1fr 32px" }}>
                      <span className="font-sans text-xs" style={{ color: "var(--ink-600)" }}>{cat.label}</span>
                      <div className="h-1.5 rounded overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                        <div
                          style={{
                            width: `${(cat.val / 5) * 100}%`,
                            height: "100%",
                            background: "var(--amber-accent)",
                          }}
                        />
                      </div>
                      <span className="font-sans text-xs font-medium tabular-nums text-right">{cat.val.toFixed(1)}</span>
                    </div>
                  ))}
                </div>

                {/* Mais referido */}
                {(c.pontos_positivos.length > 0 || c.pontos_negativos.length > 0) && (
                  <div className="mt-4 mb-4">
                    <p className="font-sans text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--ink-400)" }}>
                      Mais referido nas avaliações
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {c.pontos_positivos.length > 0 && (
                        <div className="p-3 rounded" style={{ background: "rgba(92,122,91,0.08)" }}>
                          {c.pontos_positivos.map((p, k) => (
                            <p key={k} className="font-sans text-xs leading-relaxed" style={{ color: "var(--ink-800)" }}>
                              <strong style={{ color: "var(--sage)" }}>+</strong> {p}
                            </p>
                          ))}
                        </div>
                      )}
                      {c.pontos_negativos.length > 0 && (
                        <div className="p-3 rounded" style={{ background: "rgba(168,71,42,0.08)" }}>
                          {c.pontos_negativos.map((p, k) => (
                            <p key={k} className="font-sans text-xs leading-relaxed" style={{ color: "var(--ink-800)" }}>
                              <strong style={{ color: "var(--rust)" }}>−</strong> {p}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Última avaliação completa com comentários */}
                {ultima && (ultima.pontos_positivos || ultima.pontos_negativos) && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--ink-200)" }}>
                    <p className="font-sans text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--ink-400)" }}>
                      Última avaliação{ultima.funcao ? ` · ${ultima.funcao}` : ""}
                    </p>
                    {ultima.pontos_positivos && (
                      <div className="p-3 mb-2 rounded border-l-2" style={{ borderColor: "var(--sage)", background: "rgba(92,122,91,0.05)" }}>
                        <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-800)" }}>
                          <strong style={{ color: "var(--sage)" }}>+ O que correu bem:</strong> {ultima.pontos_positivos}
                        </p>
                      </div>
                    )}
                    {ultima.pontos_negativos && (
                      <div className="p-3 rounded border-l-2" style={{ borderColor: "var(--rust)", background: "rgba(168,71,42,0.05)" }}>
                        <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-800)" }}>
                          <strong style={{ color: "var(--rust)" }}>− O que correu mal:</strong> {ultima.pontos_negativos}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
