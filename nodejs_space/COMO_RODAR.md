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

caso não funcione o @prisma completo (incluindo library.js e engines) está no `node_modules/@prisma`(portanto, não apague este node_modules), então use este comando para rodar o backend enquanto o Corepack/Yarn estiver bloqueado: 
cd C:\Users\DELL\Desktop\projects\aplicativo_de_vale_v2\nodejs_space
$env:TEMP="$PWD\.tmp"; $env:TMP=$env:TEMP
node node_modules/@nestjs/cli/bin/nest.js start --watch

**URLs uteis**
- API base: `http://localhost:2026/api`
- Swagger: `http://localhost:2026/api-docs`

**Variaveis de ambiente**
- Este projeto ja possui um `.env` neste diretorio com `DATABASE_URL` apontando para SQLite (`file:./dev.db`).
- Se quiser usar Postgres, ajuste `DATABASE_URL` e o provider em `prisma/schema.prisma`.

**Prisma (se precisar)**
- Gere o cliente: `yarn prisma generate`
- Seed opcional: `yarn prisma db seed`
