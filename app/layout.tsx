import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const serif = cormorant; // also acts as serif body

export const metadata: Metadata = {
  title: "EngFlowing — A comunidade dos engenheiros em Portugal",
  description:
    "Salários anónimos, avaliações de empresas, guias de vistos e validação de diplomas para engenheiros em Portugal e quem quer emigrar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-PT"
      className={`${cormorant.variable} ${inter.variable} ${mono.variable}`}
      style={{ ["--font-serif" as any]: "var(--font-display)" }}
    >
      <body>
        <header className="border-b border-ink-200" style={{ borderColor: "var(--ink-200)" }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-9 h-9 flex items-center justify-center"
                style={{ background: "var(--ink-900)", color: "var(--paper)" }}
              >
                <span className="font-display text-xl">E</span>
              </div>
              <div>
                <div className="font-display text-2xl leading-none" style={{ color: "var(--ink-900)" }}>
                  Eng<span style={{ color: "var(--amber-accent)" }}>Flowing</span>
                </div>
                <div className="font-sans text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: "var(--ink-400)" }}>
                  Carreira · Mobilidade · Salários
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-1 font-sans text-sm">
              <Link href="/salarios" className="px-3 py-2 hover:opacity-70 transition" style={{ color: "var(--ink-600)" }}>
                Salários
              </Link>
          <Link href="/empresas" className="px-3 py-2 hover:opacity-70 transition" style={{ color: "var(--ink-600)" }}>
                Empresas
              </Link>
              <Link href="/diplomas" className="px-3 py-2 hover:opacity-70 transition" style={{ color: "var(--ink-600)" }}>
                Diplomas
              </Link>
              <Link href="/submeter-salario" className="px-3 py-2 ml-2" style={{
                background: "var(--ink-900)",
                color: "var(--paper)",
              }}>
                Partilhar salário →
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-ink-200" style={{ borderColor: "var(--ink-200)" }}>
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 font-sans text-sm" style={{ color: "var(--ink-600)" }}>
            <div>
              <div className="font-display text-xl mb-2" style={{ color: "var(--ink-900)" }}>
                Eng<span style={{ color: "var(--amber-accent)" }}>Flowing</span>
              </div>
              <p className="leading-relaxed">
                Conhecimento partilhado entre engenheiros para decisões mais informadas.
              </p>
            </div>
            <div>
              <div className="font-sans uppercase tracking-wider text-xs mb-3" style={{ color: "var(--ink-400)" }}>
                Comunidade
              </div>
              <ul className="space-y-1.5">
                <li><Link href="/salarios" className="hover:underline">Quadro de salários</Link></li>
                <li><Link href="/empresas" className="hover:underline">Ranking de empresas</Link></li>
                <li><Link href="/diplomas" className="hover:underline">Validar diploma</Link></li>
                <li><Link href="/submeter-salario" className="hover:underline">Partilhar salário</Link></li>
                <li><Link href="/avaliar-empresa" className="hover:underline">Avaliar empresa</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-sans uppercase tracking-wider text-xs mb-3" style={{ color: "var(--ink-400)" }}>
                Sobre
              </div>
              <ul className="space-y-1.5">
                <li><Link href="/sobre" className="hover:underline">A nossa missão</Link></li>
                <li><Link href="/termos" className="hover:underline">Termos de uso</Link></li>
                <li><Link href="/privacidade" className="hover:underline">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center py-6 text-xs font-sans" style={{ color: "var(--ink-400)" }}>
            © {new Date().getFullYear()} EngFlowing · Feito em Portugal
          </div>
        </footer>
      </body>
    </html>
  );
}
