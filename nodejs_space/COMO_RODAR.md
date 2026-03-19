# Como rodar o backend (Node/NestJS)

**Requisitos**
- Node.js >= 18.18
- Yarn 4 (via Corepack)
- AWS configurado em `.env` (para upload/assinaturas)

**Passo a passo**
1. `corepack enable`
2. `yarn install`
3. `yarn prisma generate`
4. `yarn prisma db push`
5. `yarn start:dev`

**URLs uteis**
- API base: `http://localhost:2026/api`
- Swagger: `http://localhost:2026/api-docs`

**Variaveis de ambiente**
- Este projeto ja possui um `.env` neste diretorio com `DATABASE_URL` apontando para SQLite (`file:./dev.db`).
- Se quiser usar Postgres, ajuste `DATABASE_URL` e o provider em `prisma/schema.prisma`.

**Prisma (se precisar)**
- Gere o cliente: `yarn prisma generate`
- Seed opcional: `yarn prisma db seed`
