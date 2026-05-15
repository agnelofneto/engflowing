"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tab = "salaries" | "reviews";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("salaries");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_ok") !== "1") {
      router.push("/admin");
    }
  }, [router]);

  async function load() {
    setLoading(true);
    // Nota: o público não consegue ler 'pendente' por RLS, mas porque precisamos de
    // mostrá-los, vamos chamar uma API server-side com service_role
    const res = await fetch(`/api/admin/list?table=${tab}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [tab]);

  async function moderate(id: string, action: "aprovar" | "rejeitar") {
    const motivo = action === "rejeitar" ? prompt("Motivo (opcional):") || undefined : undefined;
    const res = await fetch("/api/admin/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: tab, id, action, motivo }),
    });
    if (res.ok) {
      setItems(items.filter(i => i.id !== id));
    } else {
      alert("Erro ao moderar.");
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_ok");
    fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <div>
          <div className="font-sans text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "var(--amber-accent)" }}>
            ✦ &nbsp; Moderação
          </div>
          <h1 className="font-display text-4xl" style={{ color: "var(--ink-900)" }}>Fila de aprovação</h1>
        </div>
        <button onClick={logout} className="font-sans text-sm underline" style={{ color: "var(--ink-600)" }}>Sair</button>
      </div>

      <div className="flex gap-2 mb-8 font-sans text-sm">
        {[
          { key: "salaries" as Tab, label: "Salários" },
          { key: "reviews" as Tab, label: "Avaliações de empresas" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 border transition"
            style={{
              background: tab === t.key ? "var(--ink-900)" : "transparent",
              color: tab === t.key ? "var(--paper)" : "var(--ink-900)",
              borderColor: "var(--ink-900)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-sans text-sm italic" style={{ color: "var(--ink-400)" }}>A carregar...</p>
      ) : items.length === 0 ? (
        <div className="card-paper p-12 text-center">
          <p className="font-display text-2xl" style={{ color: "var(--ink-600)" }}>Tudo aprovado. ✓</p>
          <p className="font-sans text-sm mt-2" style={{ color: "var(--ink-400)" }}>Não há submissões na fila.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card-paper p-6">
              {tab === "salaries" ? (
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h3 className="font-display text-2xl">{item.cargo}</h3>
                      <p className="font-sans text-sm" style={{ color: "var(--ink-600)" }}>
                        {item.engenharia} · {item.anos_experiencia} anos · {item.cidade || "—"}
                      </p>
                      {item.empresa && (
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-400)" }}>Empresa: {item.empresa}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl tabular-nums">{Number(item.salario_base_mensal).toLocaleString("pt-PT")} € <span className="text-sm" style={{ color: "var(--ink-400)" }}>/mês</span></p>
                      <p className="font-sans text-xs" style={{ color: "var(--ink-400)" }}>{item.forma_recebimento} salários/ano</p>
                    </div>
                  </div>
                  {item.beneficios && item.beneficios.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                      {item.beneficios.map((b: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-xs font-sans border" style={{ borderColor: "var(--ink-200)", color: "var(--ink-600)" }}>
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h3 className="font-display text-2xl">{item.empresa_nome}</h3>
                      <p className="font-sans text-sm" style={{ color: "var(--ink-600)" }}>{item.setor} · {item.localizacao}</p>
                      {item.funcao && <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-400)" }}>{item.funcao}</p>}
                    </div>
                    <div className="font-display text-2xl tabular-nums">
                      {((item.rating_salario + item.rating_ambiente + item.rating_crescimento + item.rating_lideranca + item.rating_equilibrio) / 5).toFixed(1)}★
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-3 mb-3 font-sans text-xs">
                    <div><span style={{ color: "var(--ink-400)" }}>Sal:</span> {item.rating_salario}</div>
                    <div><span style={{ color: "var(--ink-400)" }}>Amb:</span> {item.rating_ambiente}</div>
                    <div><span style={{ color: "var(--ink-400)" }}>Cresc:</span> {item.rating_crescimento}</div>
                    <div><span style={{ color: "var(--ink-400)" }}>Lid:</span> {item.rating_lideranca}</div>
                    <div><span style={{ color: "var(--ink-400)" }}>Equil:</span> {item.rating_equilibrio}</div>
                  </div>
                  {item.pontos_positivos && (
                    <p className="text-sm mt-2 p-3" style={{ background: "rgba(92,122,91,0.08)", color: "var(--ink-800)" }}>
                      <strong style={{ color: "var(--sage)" }}>+</strong> {item.pontos_positivos}
                    </p>
                  )}
                  {item.pontos_negativos && (
                    <p className="text-sm mt-2 p-3" style={{ background: "rgba(168,71,42,0.08)", color: "var(--ink-800)" }}>
                      <strong style={{ color: "var(--rust)" }}>−</strong> {item.pontos_negativos}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--ink-200)" }}>
                <button
                  onClick={() => moderate(item.id, "aprovar")}
                  className="px-4 py-2 font-sans text-sm"
                  style={{ background: "var(--sage)", color: "var(--paper)" }}
                >
                  ✓ Aprovar
                </button>
                <button
                  onClick={() => moderate(item.id, "rejeitar")}
                  className="px-4 py-2 font-sans text-sm border"
                  style={{ borderColor: "var(--rust)", color: "var(--rust)" }}
                >
                  ✗ Rejeitar
                </button>
                <span className="ml-auto font-sans text-xs italic" style={{ color: "var(--ink-400)" }}>
                  Submetido {new Date(item.created_at).toLocaleDateString("pt-PT")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
