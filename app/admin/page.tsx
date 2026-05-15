"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_ok") === "1") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("admin_ok", "1");
      router.push("/admin/dashboard");
    } else {
      setError("Palavra-passe incorreta.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="font-sans text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--amber-accent)" }}>
        ✦ &nbsp; Painel privado
      </div>
      <h1 className="font-display text-4xl mb-8" style={{ color: "var(--ink-900)" }}>Acesso de moderação</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2">Palavra-passe</label>
          <input
            type="password" required autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="p-4 border-l-2 text-sm" style={{ borderColor: "var(--rust)", background: "rgba(168,71,42,0.05)", color: "var(--rust)" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-sans text-sm disabled:opacity-50"
          style={{ background: "var(--ink-900)", color: "var(--paper)" }}
        >
          {loading ? "A verificar..." : "Entrar →"}
        </button>
      </form>
    </div>
  );
}
