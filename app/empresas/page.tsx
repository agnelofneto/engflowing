import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

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
}

export default async function EmpresasPage() {
  const { data } = await supabase
    .from("reviews")
    .select("empresa_nome, setor, localizacao, rating_salario, rating_ambiente, rating_crescimento, rating_lideranca, rating_equilibrio")
    .eq("status", "aprovado");

  const groups: Record<string, any> = {};
  (data ?? []).forEach((r: any) => {
    const key = r.empresa_nome;
    if (!groups[key]) {
      groups[key] = {
        empresa: r.empresa_nome,
        setor: r.setor,
        localizacao: r.localizacao,
        ratings: { salario: [], ambiente: [], crescimento: [], lideranca: [], equilibrio: [] },
      };
    }
    groups[key].ratings.salario.push(r.rating_salario);
    groups[key].ratings.ambiente.push(r.rating_ambiente);
    groups[key].ratings.crescimento.push(r.rating_crescimento);
    groups[key].ratings.lideranca.push(r.rating_lideranca);
    groups[key].ratings.equilibrio.push(r.rating_equilibrio);
  });

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const companies: CompanyAgg[] = Object.values(groups).map((g: any) => {
    const ms = avg(g.ratings.salario);
    const ma = avg(g.ratings.ambiente);
    const mc = avg(g.ratings.crescimento);
    const ml = avg(g.ratings.lideranca);
    const me = avg(g.ratings.equilibrio);
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
    };
  }).sort((a, b) => b.media_geral - a.media_geral);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
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
        <div className="grid md:grid-cols-2 gap-5">
          {companies.map((c, i) => (
            <div key={i} className="card-paper p-6">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <h3 className="font-display text-2xl leading-tight" style={{ color: "var(--ink-900)" }}>{c.empresa}</h3>
                  <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-400)" }}>
                    {c.setor} · {c.localizacao} · {c.total} {c.total === 1 ? "avaliação" : "avaliações"}
                  </p>
                </div>
                <div className="px-3 py-1.5 font-display text-xl tabular-nums" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
                  {c.media_geral.toFixed(1)}
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-5 font-sans">
                {[
                  { label: "Salário", val: c.media_salario },
                  { label: "Ambiente", val: c.media_ambiente },
                  { label: "Cresc.", val: c.media_crescimento },
                  { label: "Liderança", val: c.media_lideranca },
                  { label: "Equil.", val: c.media_equilibrio },
                ].map((m, j) => (
                  <div key={j} className="text-center">
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ink-400)" }}>{m.label}</div>
                    <div className="text-lg font-medium tabular-nums" style={{ color: "var(--ink-900)" }}>{m.val.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
