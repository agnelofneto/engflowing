import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ENGENHARIAS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AggregatedSalary {
  engenharia: string;
  junior: number | null;
  pleno: number | null;
  senior: number | null;
  total: number;
}

async function getAggregatedSalaries(): Promise<AggregatedSalary[]> {
  const { data } = await supabase
    .from("salaries")
    .select("engenharia, anos_experiencia, salario_base_mensal, forma_recebimento")
    .eq("status", "aprovado");

  if (!data) return [];

  const groups: Record<string, { junior: number[]; pleno: number[]; senior: number[] }> = {};

  for (const row of data) {
    if (!groups[row.engenharia]) {
      groups[row.engenharia] = { junior: [], pleno: [], senior: [] };
    }
    const meses = row.forma_recebimento === "14" ? 14 : 12;
    const anual = Number(row.salario_base_mensal) * meses;
    const exp = row.anos_experiencia;
    const bucket = exp <= 3 ? "junior" : exp <= 7 ? "pleno" : "senior";
    groups[row.engenharia][bucket].push(anual);
  }

  const avg = (arr: number[]) => (arr.length >= 5 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null);

  return Object.entries(groups).map(([engenharia, b]) => ({
    engenharia,
    junior: avg(b.junior),
    pleno: avg(b.pleno),
    senior: avg(b.senior),
    total: b.junior.length + b.pleno.length + b.senior.length,
  })).sort((a, b) => b.total - a.total);
}

async function getCounts() {
  const [s, c, r] = await Promise.all([
    supabase.from("salaries").select("id", { count: "exact", head: true }).eq("status", "aprovado"),
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "aprovado"),
  ]);
  return {
    salaries: s.count ?? 0,
    companies: c.count ?? 0,
    reviews: r.count ?? 0,
  };
}

export default async function HomePage() {
 const [cargoSummary, counts] = await Promise.all([getCargoSummary(), getCounts()]);
  const topCargos = cargoSummary.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* HERO — editorial, no generic gradients */}
      <section className="pt-16 pb-20 grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7">
          <div className="font-sans text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "var(--amber-accent)" }}>
            ✦ &nbsp; Vol. I &nbsp; · &nbsp; Edição contínua &nbsp; · &nbsp; Lisboa &nbsp; ·
          </div>
          <h1 className="font-display text-[2.8rem] md:text-[4rem] leading-[1.05] mb-6" style={{ color: "var(--ink-900)" }}>
            O que vale o teu<br />
            <em style={{ color: "var(--amber-accent)", fontStyle: "italic" }}>trabalho</em>
            <span style={{ color: "var(--ink-400)" }}>,</span> verdadeiramente?
          </h1>
          <p className="text-xl leading-relaxed mb-8" style={{ color: "var(--ink-600)" }}>
            Salários reais. Avaliações sem filtros. Guias práticos de vistos e
            equivalência de diplomas. Construído pela comunidade dos engenheiros
            que vivem — ou querem viver — em Portugal.
          </p>
          <div className="flex flex-wrap gap-3 font-sans text-sm">
            <Link
              href="/submeter-salario"
              className="px-6 py-3 hover:opacity-90 transition"
              style={{ background: "var(--ink-900)", color: "var(--paper)" }}
            >
              Partilhar o meu salário →
            </Link>
            <Link
              href="/salarios"
              className="px-6 py-3 border hover:bg-white/30 transition"
              style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
            >
              Ver o quadro completo
            </Link>
          </div>
        </div>

        {/* Right column — masthead stat block */}
        <aside className="md:col-span-5 md:pl-8 md:border-l" style={{ borderColor: "var(--ink-200)" }}>
          <div className="font-sans text-xs uppercase tracking-[0.25em] mb-5" style={{ color: "var(--ink-400)" }}>
            Nesta edição
          </div>
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-dashed" style={{ borderColor: "var(--ink-200)" }}>
              <dt className="font-sans text-sm" style={{ color: "var(--ink-600)" }}>Salários partilhados</dt>
              <dd className="font-display text-3xl tabular-nums" style={{ color: "var(--ink-900)" }}>
                {counts.salaries.toLocaleString("pt-PT")}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-dashed" style={{ borderColor: "var(--ink-200)" }}>
              <dt className="font-sans text-sm" style={{ color: "var(--ink-600)" }}>Empresas avaliadas</dt>
              <dd className="font-display text-3xl tabular-nums" style={{ color: "var(--ink-900)" }}>
                {counts.companies.toLocaleString("pt-PT")}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-dashed" style={{ borderColor: "var(--ink-200)" }}>
              <dt className="font-sans text-sm" style={{ color: "var(--ink-600)" }}>Avaliações registadas</dt>
              <dd className="font-display text-3xl tabular-nums" style={{ color: "var(--ink-900)" }}>
                {counts.reviews.toLocaleString("pt-PT")}
              </dd>
            </div>
            <div className="pt-2 text-xs font-sans italic" style={{ color: "var(--ink-400)" }}>
              Cada nova submissão melhora a precisão do que aqui se publica.
            </div>
          </dl>
        </aside>
      </section>

      {/* DIVIDER */}
      <div className="divider"><span className="divider-mark">✦</span></div>

      {/* SALARY TABLE */}
      <section className="pb-20">
        <div className="grid md:grid-cols-12 gap-6 mb-8 items-end">
          <div className="md:col-span-8">
            <div className="font-sans text-xs uppercase tracking-[0.25em] mb-3" style={{ color: "var(--amber-accent)" }}>
              Quadro I
            </div>
            <h2 className="font-display text-4xl md:text-5xl mb-3" style={{ color: "var(--ink-900)" }}>
              Salários médios por engenharia
            </h2>
            <p className="font-sans text-sm leading-relaxed max-w-xl" style={{ color: "var(--ink-600)" }}>
              Valores brutos anuais em euros, agregados a partir das submissões da comunidade.
              Apenas cadeias com cinco ou mais submissões são publicadas — proteção mínima de anonimato.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link href="/submeter-salario" className="font-sans text-sm underline underline-offset-4" style={{ color: "var(--amber-deep)" }}>
              Contribuir →
            </Link>
          </div>
        </div>

        <div className="card-paper p-2 md:p-6">
          <table className="w-full font-sans">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--ink-900)" }}>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>
                  Engenharia
                </th>
                <th className="text-right py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>
                  Júnior <span className="font-normal lowercase" style={{ color: "var(--ink-400)" }}>0–3 anos</span>
                </th>
                <th className="text-right py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>
                  Pleno <span className="font-normal lowercase" style={{ color: "var(--ink-400)" }}>3–7 anos</span>
                </th>
                <th className="text-right py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>
                  Sénior <span className="font-normal lowercase" style={{ color: "var(--ink-400)" }}>7+ anos</span>
                </th>
                <th className="text-center py-3 px-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>
                  N
                </th>
              </tr>
            </thead>
            <tbody>
              {ENGENHARIAS.filter(e => e !== "Outra").map((eng) => {
                const row = aggregated.find(a => a.engenharia === eng);
                const fmt = (n: number | null | undefined) =>
                  n ? `${n.toLocaleString("pt-PT")} €` : <span style={{ color: "var(--ink-400)" }}>—</span>;
                return (
                  <tr key={eng} className="border-b border-dashed" style={{ borderColor: "var(--ink-200)" }}>
                    <td className="py-3 px-2 text-sm" style={{ color: "var(--ink-900)" }}>{eng}</td>
                    <td className="py-3 px-2 text-right text-sm tabular-nums">{fmt(row?.junior)}</td>
                    <td className="py-3 px-2 text-right text-sm tabular-nums">{fmt(row?.pleno)}</td>
                    <td className="py-3 px-2 text-right text-sm tabular-nums">{fmt(row?.senior)}</td>
                    <td className="py-3 px-2 text-center text-xs tabular-nums" style={{ color: "var(--ink-400)" }}>
                      {row?.total || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {aggregated.length === 0 && (
            <div className="text-center py-10 font-sans text-sm italic" style={{ color: "var(--ink-400)" }}>
              Ainda não há submissões aprovadas. Sê o primeiro a partilhar.
            </div>
          )}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="divider"><span className="divider-mark">✦</span></div>

      {/* THREE PRINCIPLES */}
      <section className="pb-20">
        <div className="text-center mb-12">
          <div className="font-sans text-xs uppercase tracking-[0.25em] mb-3" style={{ color: "var(--amber-accent)" }}>
            Os três pilares
          </div>
          <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--ink-900)" }}>
            Por que estamos aqui
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "I.",
              title: "Anonimato real",
              body: "Não pedimos registo, não guardamos o teu IP. Cada submissão é avaliada antes de ser publicada — sem tags pessoais, sem rasto.",
            },
            {
              num: "II.",
              title: "Decisões com dados",
              body: "Os engenheiros tomam decisões importantes — mudar de país, aceitar uma proposta, pedir aumento — frequentemente sem informação. Mudamos isso.",
            },
            {
              num: "III.",
              title: "Comunidade técnica",
              body: "Para quem está em Portugal e para quem quer vir. Vistos, equivalência de diplomas, Ordem dos Engenheiros — tudo o que ninguém explica bem.",
            },
          ].map((p) => (
            <div key={p.num} className="pl-6 border-l" style={{ borderColor: "var(--amber-accent)" }}>
              <div className="font-display text-3xl mb-3" style={{ color: "var(--amber-accent)" }}>
                {p.num}
              </div>
              <h3 className="font-display text-2xl mb-3" style={{ color: "var(--ink-900)" }}>
                {p.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="card-paper grain p-12 md:p-16 text-center relative overflow-hidden">
          <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
            ✦ &nbsp; Contribuir
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-5 max-w-2xl mx-auto" style={{ color: "var(--ink-900)" }}>
            Cada submissão fortalece a próxima decisão de carreira.
          </h2>
          <p className="font-sans text-base max-w-xl mx-auto mb-8" style={{ color: "var(--ink-600)" }}>
            Demora dois minutos. Sem registo. Sem nomes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 font-sans text-sm">
            <Link
              href="/submeter-salario"
              className="px-6 py-3 hover:opacity-90 transition"
              style={{ background: "var(--ink-900)", color: "var(--paper)" }}
            >
              Partilhar salário →
            </Link>
            <Link
              href="/avaliar-empresa"
              className="px-6 py-3 border hover:bg-white/30 transition"
              style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
            >
              Avaliar empresa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
