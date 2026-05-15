# EngFlowing

Plataforma da comunidade de engenheiros em Portugal — salários anónimos, avaliações de empresas, guias de vistos e diplomas.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** para estilos
- **Supabase** (Postgres + RLS) para base de dados
- **Vercel** para hosting (deploy automático a partir do GitHub)

## Estrutura

```
engflowing/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Layout global (header + footer)
│   ├── globals.css                 # Estilos globais
│   ├── salarios/                   # Lista de salários aprovados
│   ├── empresas/                   # Ranking de empresas
│   ├── submeter-salario/           # Formulário de salário
│   ├── avaliar-empresa/            # Formulário de avaliação
│   ├── sobre/                      # Página "Sobre"
│   ├── termos/                     # Termos de uso
│   ├── privacidade/                # Política de privacidade
│   ├── admin/                      # Painel de moderação
│   │   ├── page.tsx                # Login
│   │   └── dashboard/page.tsx      # Fila de aprovação
│   └── api/admin/                  # Endpoints protegidos
│       ├── login/route.ts
│       ├── logout/route.ts
│       ├── list/route.ts           # Listar pendentes
│       └── moderate/route.ts       # Aprovar / rejeitar
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   └── constants.ts                # Listas (engenharias, setores, etc.)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## Variáveis de ambiente

Configurar na Vercel em **Settings → Environment Variables**:

| Nome | Onde encontrar |
|------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API Keys → Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API Keys → Secret key |
| `ADMIN_PASSWORD` | Definir uma palavra-passe forte para o painel `/admin` |

## Painel de admin

- URL: `/admin`
- Login com a palavra-passe `ADMIN_PASSWORD`
- Aprovar ou rejeitar submissões na fila

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local       # preencher com chaves Supabase
npm run dev                       # http://localhost:3000
```
