import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function nivelFromExp(anos: number): { label: string; bg: string; color: string } {
  if (anos <= 3) return { label: "Júnior", bg: "rgba(55,138,221,0.12)", color: "#042C53" };
  if (anos <= 7) return { label: "Pleno", bg: "rgba(186,117,23,0.12)", color: "#854F0B" };
  return { label: "Sénior", bg: "rgba(15,110,86,0.12)", color: "#04342C" };
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? "semana" : "semanas"}`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? "mês" : "meses"}`;
  return `Há ${Math.floor(diffDays / 365)} ano(s)`;
}

interface AggregatedGroup {
  cargo: string;
  cidade: string;
  nivel: { label: string; bg: string; color: string };
  baseMensal: number;
  liquidoMensal: number | null;
  n: number;
}

function aggregateByGroup(rows: any[]): AggregatedGroup[] {
  const groups: Record<string, any> = {};
  rows.forEach((r) => {
    const cargo = (r.cargo || "").trim();
    const cidade = (r.cidade || "Não indicada").trim();
    const nivel = nivelFromExp(r.anos_experiencia);
    const key = `${cargo.toLowerCase()}|${cidade.toLowerCase()}|${nivel.label}`;
    if (!groups[key]) {
      groups[key] = {
        cargo,
        cidade,
        nivel,
        bases: [] as number[],
        liquidos: [] as number[],
      };
    }
    if (r.salario_base_mensal) groups[key].bases.push(Number(r.salario_base_mensal));
    if (r.salario_liquido_mensal) groups[key].liquidos.push(Number(r.salario_liquido_mensal));
  });

  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

  return Object.values(groups)
    .map((g: any) => ({
      cargo: g.cargo,
      cidade: g.cidade,
      nivel: g.nivel,
      baseMensal: avg(g.bases),
      liquidoMensal: g.liquidos.length > 0 ? avg(g.liquidos) : null,
      n: g.bases.length,
    }))
    .sort((a, b) => b.baseMensal - a.baseMensal);
}

export default async function SalariosPage() {
  const { data } = await supabase
    .from("salaries")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];
  const aggregated = aggregateByGroup(rows);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-sans text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "var(--amber-accent)" }}>
            ✦ &nbsp; Quadro de salários
          </div>
          <h1 className="font-display text-5xl mb-3" style={{ color: "var(--ink-900)" }}>
            Salários reais, partilhados anonimamente
          </h1>
          <p className="text-lg" style={{ color: "var(--ink-600)" }}>
            {rows.length} {rows.length === 1 ? "submissão aprovada" : "submissões aprovadas"}
          </p>
        </div>
        <Link
          href="/submeter-salario"
          className="px-6 py-3 font-sans text-sm"
          style={{ background: "var(--ink-900)", color: "var(--paper)" }}
        >
          Partilhar o meu →
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="card-paper p-16 text-center">
          <p className="font-display text-2xl mb-4" style={{ color: "var(--ink-600)" }}>
            Ainda não há submissões aprovadas.
          </p>
          <Link href="/submeter-salario" className="px-6 py-3 font-sans text-sm" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
            Partilhar o meu salário →
          </Link>
        </div>
      ) : (
        <>
          <section className="mb-12">
            <div className="flex justify-between items-baseline mb-3">
              <p className="font-sans text-xs uppercase tracking-[0.2em]" style={{ color: "var(--ink-600)" }}>
                Resumo agregado por cargo
              </p>
              <p className="font-sans text-xs italic" style={{ color: "var(--ink-400)" }}>
                Médias calculadas com as submissões disponíveis
              </p>
            </div>
            <div className="card-paper overflow-x-auto">
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
                    <th className="text-left py-3 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Cargo</th>
                    <th className="text-left py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Cidade</th>
                    <th className="text-center py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Nível</th>
                    <th className="text-right py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Base/mês</th>
                    <th className="text-right py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Líq./mês</th>
                    <th className="text-right py-3 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>N</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregated.map((g, i) => (
                    <tr key={i} className="border-b border-dashed" style={{ borderColor: "var(--ink-200)" }}>
                      <td className="py-3 px-3" style={{ color: "var(--ink-900)" }}>{g.cargo}</td>
                      <td className="py-3 px-2" style={{ color: "var(--ink-600)" }}>{g.cidade}</td>
                      <td className="text-center py-3 px-2">
                        <span className="font-sans text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: g.nivel.bg, color: g.nivel.color }}>
                          {g.nivel.label}
                        </span>
                      </td>
                      <td className="text-right py-3 px-2 tabular-nums font-medium">
                        {g.baseMensal.toLocaleString("pt-PT")} €
                      </td>
                      <td className="text-right py-3 px-2 tabular-nums">
                        {g.liquidoMensal ? `${g.liquidoMensal.toLocaleString("pt-PT")} €` : <span style={{ color: "var(--ink-400)" }}>—</span>}
                      </td>
                      <td className="text-right py-3 px-3 text-xs" style={{ color: "var(--ink-400)" }}>{g.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <p className="font-sans text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "var(--ink-600)" }}>
              Submissões individuais detalhadas
            </p>
            <div className="space-y-3">
              {rows.map((r: any, i: number) => {
                const meses = r.forma_recebimento === "14" ? 14 : 12;
                const anual = Number(r.salario_base_mensal) * meses;
                const nivel = nivelFromExp(r.anos_experiencia);
                return (
                  <div key={i} className="card-paper p-6">
                    <div className="flex justify-between items-start gap-4 flex-wrap mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-2xl leading-tight" style={{ color: "var(--ink-900)" }}>{r.cargo}</h3>
                        <p className="font-sans text-sm mt-1" style={{ color: "var(--ink-600)" }}>
                          {r.engenharia} · {r.anos_experiencia} {r.anos_experiencia === 1 ? "ano" : "anos"}{r.cidade ? ` · ${r.cidade}` : ""}
                        </p>
                        {r.empresa ? (
                          <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-400)" }}>🏢 {r.empresa}</p>
                        ) : (
                          <p className="font-sans text-xs mt-1 italic" style={{ color: "var(--ink-400)" }}>Empresa não indicada</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl tabular-nums" style={{ color: "var(--ink-900)" }}>
                          {Number(r.salario_base_mensal).toLocaleString("pt-PT")} €
                          <span className="font-sans text-sm font-normal" style={{ color: "var(--ink-400)" }}> /mês</span>
                        </p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-400)" }}>
                          {meses} salários · {anual.toLocaleString("pt-PT")} €/ano
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-t border-b" style={{ borderColor: "var(--ink-200)" }}>
                      <div>
                        <p className="font-sans uppercase tracking-wider text-[10px]" style={{ color: "var(--ink-400)" }}>Líquido/mês</p>
                        <p className="font-sans text-sm font-medium mt-1" style={{ color: r.salario_liquido_mensal ? "var(--ink-900)" : "var(--ink-400)" }}>
                          {r.salario_liquido_mensal ? `${Number(r.salario_liquido_mensal).toLocaleString("pt-PT")} €` : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans uppercase tracking-wider text-[10px]" style={{ color: "var(--ink-400)" }}>Líquido/ano</p>
                        <p className="font-sans text-sm font-medium mt-1" style={{ color: r.salario_liquido_anual ? "var(--ink-900)" : "var(--ink-400)" }}>
                          {r.salario_liquido_anual ? `${Number(r.salario_liquido_anual).toLocaleString("pt-PT")} €` : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans uppercase tracking-wider text-[10px]" style={{ color: "var(--ink-400)" }}>Subs. alim.</p>
                        <p className="font-sans text-sm font-medium mt-1" style={{ color: r.subsidio_alimentacao_dia ? "var(--ink-900)" : "var(--ink-400)" }}>
                          {r.subsidio_alimentacao_dia ? `${Number(r.subsidio_alimentacao_dia).toFixed(2)} €/dia` : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans uppercase tracking-wider text-[10px]" style={{ color: "var(--ink-400)" }}>Nível</p>
                        <p className="font-sans text-sm font-medium mt-1" style={{ color: "var(--ink-900)" }}>{nivel.label}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-2 flex-wrap mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.beneficios && r.beneficios.length > 0 ? (
                          r.beneficios.map((b: string, j: number) => (
                            <span key={j} className="font-sans text-xs px-2 py-1 rounded" style={{ background: "rgba(92,122,91,0.12)", color: "var(--sage)" }}>
                              {b}
                            </span>
                          ))
                        ) : (
                          <span className="font-sans text-xs italic" style={{ color: "var(--ink-400)" }}>
                            Sem benefícios indicados
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs italic" style={{ color: "var(--ink-400)" }}>
                        {formatRelativeDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
