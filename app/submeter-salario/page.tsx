"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ENGENHARIAS, BENEFICIOS } from "@/lib/constants";

export default function SubmeterSalarioPage() {
  const [form, setForm] = useState({
    engenharia: "",
    cargo: "",
    anos_experiencia: "",
    cidade: "",
    empresa: "",
    forma_recebimento: "14",
    salario_base_mensal: "",
    salario_liquido_mensal: "",
    salario_liquido_anual: "",
    subsidio_alimentacao_dia: "",
  });
  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  function toggleBeneficio(b: string) {
    setBeneficios(beneficios.includes(b) ? beneficios.filter(x => x !== b) : [...beneficios, b]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!form.engenharia || !form.cargo || !form.anos_experiencia || !form.salario_base_mensal) {
      setError("Por favor preenche os campos obrigatórios.");
      setSubmitting(false);
      return;
    }

    const payload = {
      engenharia: form.engenharia,
      cargo: form.cargo.trim(),
      anos_experiencia: parseInt(form.anos_experiencia),
      cidade: form.cidade.trim() || null,
      empresa: form.empresa.trim() || null,
      forma_recebimento: form.forma_recebimento,
      salario_base_mensal: parseFloat(form.salario_base_mensal),
      salario_liquido_mensal: form.salario_liquido_mensal ? parseFloat(form.salario_liquido_mensal) : null,
      salario_liquido_anual: form.salario_liquido_anual ? parseFloat(form.salario_liquido_anual) : null,
      subsidio_alimentacao_dia: form.subsidio_alimentacao_dia ? parseFloat(form.subsidio_alimentacao_dia) : null,
      beneficios: beneficios.length > 0 ? beneficios : null,
      status: "pendente",
    };

    const { error: dbError } = await supabase.from("salaries").insert(payload);

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
        <h1 className="font-display text-5xl mb-6" style={{ color: "var(--ink-900)" }}>
          Obrigado.
        </h1>
        <p className="text-lg mb-3" style={{ color: "var(--ink-600)" }}>
          A tua submissão entrou na fila de moderação.
        </p>
        <p className="text-base mb-10" style={{ color: "var(--ink-400)" }}>
          Depois de aprovada, vai contribuir para o quadro público de salários.
          Não guardamos nenhum dado que te identifique.
        </p>
        <div className="flex flex-wrap justify-center gap-3 font-sans text-sm">
          <Link
            href="/"
            className="px-6 py-3"
            style={{ background: "var(--ink-900)", color: "var(--paper)" }}
          >
            Voltar à página inicial
          </Link>
          <Link
            href="/avaliar-empresa"
            className="px-6 py-3 border"
            style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          >
            Avaliar uma empresa também →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
          ✦ &nbsp; Submissão anónima
        </div>
        <h1 className="font-display text-5xl mb-4" style={{ color: "var(--ink-900)" }}>
          Partilhar o meu salário
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--ink-600)" }}>
          Apenas os campos marcados com <span style={{ color: "var(--rust)" }}>*</span> são obrigatórios.
          Demora menos de dois minutos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-2xl" style={{ color: "var(--amber-accent)" }}>I.</span>
            <h2 className="font-display text-2xl" style={{ color: "var(--ink-900)" }}>Identificação profissional</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-2">Engenharia <span style={{ color: "var(--rust)" }}>*</span></label>
              <select required value={form.engenharia} onChange={(e) => update("engenharia", e.target.value)}>
                <option value="">Selecionar área...</option>
                {ENGENHARIAS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-2">Cargo <span style={{ color: "var(--rust)" }}>*</span></label>
              <input
                type="text"
                required
                value={form.cargo}
                onChange={(e) => update("cargo", e.target.value)}
                placeholder="Ex: Engenheiro de projeto, Project Manager, Engenheiro júnior..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">Anos de experiência <span style={{ color: "var(--rust)" }}>*</span></label>
                <input
                  type="number"
                  required
                  min={0}
                  max={50}
                  value={form.anos_experiencia}
                  onChange={(e) => update("anos_experiencia", e.target.value)}
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block mb-2">Cidade / Distrito</label>
                <input
                  type="text"
                  value={form.cidade}
                  onChange={(e) => update("cidade", e.target.value)}
                  placeholder="Lisboa, Porto, remoto..."
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">
                Empresa <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>opcional — podes deixar em branco</span>
              </label>
              <input
                type="text"
                value={form.empresa}
                onChange={(e) => update("empresa", e.target.value)}
                placeholder="Nome da empresa (opcional)"
              />
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-2xl" style={{ color: "var(--amber-accent)" }}>II.</span>
            <h2 className="font-display text-2xl" style={{ color: "var(--ink-900)" }}>Remuneração</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-3">Forma de recebimento <span style={{ color: "var(--rust)" }}>*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "12", label: "12 salários", hint: "" },
                  { value: "14", label: "14 salários", hint: "mais comum em PT" },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer p-4 border transition ${form.forma_recebimento === opt.value ? "bg-white/80" : "bg-white/30 hover:bg-white/50"}`}
                    style={{
                      borderColor: form.forma_recebimento === opt.value ? "var(--amber-accent)" : "var(--ink-200)",
                    }}
                  >
                    <input
                      type="radio"
                      name="forma"
                      value={opt.value}
                      checked={form.forma_recebimento === opt.value}
                      onChange={(e) => update("forma_recebimento", e.target.value)}
                      className="mr-2"
                    />
                    <span className="font-medium text-sm">{opt.label}</span>
                    {opt.hint && <span className="block text-xs italic mt-1 ml-5" style={{ color: "var(--ink-400)" }}>{opt.hint}</span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">
                  Salário-base mensal (€) <span style={{ color: "var(--rust)" }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={form.salario_base_mensal}
                  onChange={(e) => update("salario_base_mensal", e.target.value)}
                  placeholder="Ex: 2200"
                />
                <p className="text-xs italic mt-1.5" style={{ color: "var(--ink-400)" }}>Bruto, antes de impostos</p>
              </div>
              <div>
                <label className="block mb-2">
                  Salário líquido mensal (€) <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>opcional</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.salario_liquido_mensal}
                  onChange={(e) => update("salario_liquido_mensal", e.target.value)}
                  placeholder="Ex: 1580"
                />
                <p className="text-xs italic mt-1.5" style={{ color: "var(--ink-400)" }}>Após IRS e Seg. Social</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">
                  Salário líquido anual (€) <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>opcional</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.salario_liquido_anual}
                  onChange={(e) => update("salario_liquido_anual", e.target.value)}
                  placeholder="Ex: 22120"
                />
              </div>
              <div>
                <label className="block mb-2">
                  Subsídio de alimentação (€/dia) <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>opcional</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.subsidio_alimentacao_dia}
                  onChange={(e) => update("subsidio_alimentacao_dia", e.target.value)}
                  placeholder="Ex: 9.60"
                />
              </div>
            </div>

            <div>
              <label className="block mb-3">
                Benefícios <span className="text-xs italic ml-1" style={{ color: "var(--ink-400)" }}>opcional — marca todos os que recebes</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {BENEFICIOS.map(b => (
                  <label
                    key={b}
                    className="flex items-center gap-2.5 p-3 cursor-pointer border hover:bg-white/40 transition"
                    style={{
                      borderColor: beneficios.includes(b) ? "var(--amber-accent)" : "var(--ink-200)",
                      background: beneficios.includes(b) ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={beneficios.includes(b)}
                      onChange={() => toggleBeneficio(b)}
                    />
                    <span className="text-sm font-sans">{b}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Privacy notice */}
        <div className="p-5 border-l-2" style={{ borderColor: "var(--sage)", background: "rgba(92,122,91,0.05)" }}>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>
            <strong style={{ color: "var(--ink-900)" }}>Submissão anónima.</strong> Não guardamos o teu IP nem
            email. Os dados são agregados antes de serem mostrados publicamente
            (mínimo de 5 submissões por combinação).
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
          {submitting ? "A enviar..." : "Submeter salário →"}
        </button>
      </form>
    </div>
  );
}
