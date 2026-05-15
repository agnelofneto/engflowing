"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SETORES } from "@/lib/constants";

const CATEGORIAS = [
  { key: "salario", label: "Salário e benefícios", hint: "Remuneração face ao mercado, regalias, progressão salarial" },
  { key: "ambiente", label: "Ambiente de trabalho", hint: "Cultura, colegas, espaços físicos, segurança em obra" },
  { key: "crescimento", label: "Oportunidade de crescimento", hint: "Promoções, formação, mudança de função, projetos desafiantes" },
  { key: "lideranca", label: "Liderança e gestão", hint: "Qualidade das chefias, comunicação, organização interna" },
  { key: "equilibrio", label: "Equilíbrio trabalho / vida", hint: "Horas extra, flexibilidade, férias, deslocações" },
] as const;

type RatingKey = typeof CATEGORIAS[number]["key"];

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-2xl transition hover:scale-110"
          style={{ color: n <= value ? "var(--amber-accent)" : "var(--ink-200)", lineHeight: 1 }}
          aria-label={`${n} estrelas`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function AvaliarEmpresaPage() {
  const [form, setForm] = useState({
    empresa_nome: "",
    localizacao: "",
    setor: "",
    funcao: "",
    pontos_positivos: "",
    pontos_negativos: "",
  });
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    salario: 0, ambiente: 0, crescimento: 0, lideranca: 0, equilibrio: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.empresa_nome || !form.localizacao || !form.setor) {
      setError("Preenche os campos obrigatórios.");
      return;
    }
    if (Object.values(ratings).some(r => r === 0)) {
      setError("Atribui pelo menos 1 estrela em cada categoria.");
      return;
    }

    setSubmitting(true);

    const { error: dbError } = await supabase.from("reviews").insert({
      empresa_nome: form.empresa_nome.trim(),
      localizacao: form.localizacao.trim(),
      setor: form.setor,
      funcao: form.funcao.trim() || null,
      rating_salario: ratings.salario,
      rating_ambiente: ratings.ambiente,
      rating_crescimento: ratings.crescimento,
      rating_lideranca: ratings.lideranca,
      rating_equilibrio: ratings.equilibrio,
      pontos_positivos: form.pontos_positivos.trim() || null,
      pontos_negativos: form.pontos_negativos.trim() || null,
      status: "pendente",
    });

    if (dbError) {
      setError("Algo correu mal. Tenta novamente.");
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="font-sans text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "var(--amber-accent)" }}>
          ✦ &nbsp; Recebido
        </div>
        <h1 className="font-display text-5xl mb-6" style={{ color: "var(--ink-900)" }}>Obrigado.</h1>
        <p className="text-lg mb-3" style={{ color: "var(--ink-600)" }}>
          A tua avaliação entrou na fila de moderação.
        </p>
        <p className="text-base mb-10" style={{ color: "var(--ink-400)" }}>
          Será publicada depois de revista. Avaliações ofensivas, com nomes de pessoas
          ou difamatórias são rejeitadas.
        </p>
        <Link href="/" className="inline-block px-6 py-3 font-sans text-sm" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
          ✦ &nbsp; Avaliação anónima
        </div>
        <h1 className="font-display text-5xl mb-4" style={{ color: "var(--ink-900)" }}>Avaliar uma empresa</h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--ink-600)" }}>
          Ajuda outros engenheiros a tomar decisões informadas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Identificação */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-2xl" style={{ color: "var(--amber-accent)" }}>I.</span>
            <h2 className="font-display text-2xl" style={{ color: "var(--ink-900)" }}>Identificação da empresa</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block mb-2">Nome da empresa <span style={{ color: "var(--rust)" }}>*</span></label>
              <input
                type="text" required
                value={form.empresa_nome}
                onChange={(e) => update("empresa_nome", e.target.value)}
                placeholder="Ex: EDP Renováveis, Mota-Engil, Critical Software..."
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">Localização <span style={{ color: "var(--rust)" }}>*</span></label>
                <input
                  type="text" required
                  value={form.localizacao}
                  onChange={(e) => update("localizacao", e.target.value)}
                  placeholder="Lisboa, Porto, remoto..."
                />
              </div>
              <div>
                <label className="block mb-2">Setor / atividade <span style={{ color: "var(--rust)" }}>*</span></label>
                <select required value={form.setor} onChange={(e) => update("setor", e.target.value)}>
                  <option value="">Selecionar...</option>
                  {SETORES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-2">
                A tua função na empresa <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>opcional</span>
              </label>
              <input
                type="text"
                value={form.funcao}
                onChange={(e) => update("funcao", e.target.value)}
                placeholder="Ex: Engenheiro de obra; ainda lá trabalho / saí há 1 ano"
              />
            </div>
          </div>
        </section>

        {/* Ratings */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-2xl" style={{ color: "var(--amber-accent)" }}>II.</span>
            <h2 className="font-display text-2xl" style={{ color: "var(--ink-900)" }}>Avaliação por categoria</h2>
          </div>
          <div className="space-y-5">
            {CATEGORIAS.map((cat) => (
              <div
                key={cat.key}
                className="flex items-center justify-between gap-4 pb-4 border-b border-dashed"
                style={{ borderColor: "var(--ink-200)" }}
              >
                <div className="flex-1">
                  <div className="font-sans font-medium text-sm" style={{ color: "var(--ink-900)" }}>{cat.label}</div>
                  <div className="font-sans text-xs italic mt-1" style={{ color: "var(--ink-400)" }}>{cat.hint}</div>
                </div>
                <StarRating value={ratings[cat.key]} onChange={(n) => setRatings({ ...ratings, [cat.key]: n })} />
              </div>
            ))}
          </div>
        </section>

        {/* Experiência pessoal */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-2xl" style={{ color: "var(--amber-accent)" }}>III.</span>
            <h2 className="font-display text-2xl" style={{ color: "var(--ink-900)" }}>Experiência pessoal</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block mb-2" style={{ color: "var(--sage)" }}>
                + O que correu bem <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>máx. 300 caracteres</span>
              </label>
              <textarea
                maxLength={300} rows={3}
                value={form.pontos_positivos}
                onChange={(e) => update("pontos_positivos", e.target.value)}
                placeholder="Ex: Equipa técnica forte, projetos europeus, formação contínua paga..."
              />
              <div className="text-xs text-right mt-1" style={{ color: "var(--ink-400)" }}>
                {form.pontos_positivos.length}/300
              </div>
            </div>
            <div>
              <label className="block mb-2" style={{ color: "var(--rust)" }}>
                − O que correu mal <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>máx. 300 caracteres</span>
              </label>
              <textarea
                maxLength={300} rows={3}
                value={form.pontos_negativos}
                onChange={(e) => update("pontos_negativos", e.target.value)}
                placeholder="Ex: Horas extra recorrentes não compensadas, comunicação fraca da gestão de topo..."
              />
              <div className="text-xs text-right mt-1" style={{ color: "var(--ink-400)" }}>
                {form.pontos_negativos.length}/300
              </div>
            </div>
          </div>
        </section>

        <div className="p-5 border-l-2" style={{ borderColor: "var(--amber-accent)", background: "rgba(200,128,26,0.05)" }}>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>
            <strong style={{ color: "var(--ink-900)" }}>Regras simples:</strong> sem nomes de
            colegas ou chefias. Críticas factuais, não pessoais. Avaliações ofensivas ou
            difamatórias serão removidas.
          </p>
        </div>

        {error && (
          <div className="p-5 border-l-2" style={{ borderColor: "var(--rust)", background: "rgba(168,71,42,0.05)" }}>
            <p className="font-sans text-sm" style={{ color: "var(--rust)" }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 font-sans text-base font-medium hover:opacity-90 transition disabled:opacity-50"
          style={{ background: "var(--ink-900)", color: "var(--paper)" }}
        >
          {submitting ? "A enviar..." : "Publicar avaliação →"}
        </button>
      </form>
    </div>
  );
}
