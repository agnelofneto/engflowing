import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SalariosPage() {
  const { data } = await supabase
    .from("salaries")
    .select("engenharia, cargo, anos_experiencia, cidade, empresa, forma_recebimento, salario_base_mensal, beneficios, created_at")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
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
          <p className="font-sans text-sm mb-8" style={{ color: "var(--ink-400)" }}>
            Sê dos primeiros a contribuir para o quadro público.
          </p>
          <Link href="/submeter-salario" className="px-6 py-3 font-sans text-sm" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
            Partilhar o meu salário →
          </Link>
        </div>
      ) : (
        <div className="card-paper overflow-x-auto">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--ink-900)" }}>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Cargo</th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Engenharia</th>
                <th className="text-center py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Exp.</th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Bruto/ano</th>
                <th className="text-center py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--ink-600)" }}>Cidade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const meses = r.forma_recebimento === "14" ? 14 : 12;
                const anual = Number(r.salario_base_mensal) * meses;
                return (
                  <tr key={i} className="border-b border-dashed" style={{ borderColor: "var(--ink-200)" }}>
                    <td className="py-3 px-4" style={{ color: "var(--ink-900)" }}>{r.cargo}</td>
                    <td className="py-3 px-4" style={{ color: "var(--ink-600)" }}>{r.engenharia}</td>
                    <td className="py-3 px-4 text-center tabular-nums">{r.anos_experiencia}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-medium">
                      {anual.toLocaleString("pt-PT")} €
                    </td>
                    <td className="py-3 px-4 text-center" style={{ color: "var(--ink-400)" }}>{r.cidade || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
