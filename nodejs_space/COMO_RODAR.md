# Como rodar o backend (Node/NestJS)

**Requisitos**
- Node.js >= 18.18
- Yarn 4 (via Corepack)
- Acesso ao banco e AWS configurados em `.env`

**Passo a passo**
1. `corepack enable`
2. `yarn install`
3. `yarn start:dev`

**URLs uteis**
- API base: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`

**Variaveis de ambiente**
- Este projeto ja possui um `.env` neste diretorio. Ajuste valores se precisar apontar para outro banco ou bucket.
- Se rodar em outra maquina/dispositivo, confirme que `DATABASE_URL` e credenciais AWS estao corretos.

**Prisma (se precisar)**
- Gere o cliente: `yarn prisma generate`
- Seed opcional: `yarn prisma db seed`
