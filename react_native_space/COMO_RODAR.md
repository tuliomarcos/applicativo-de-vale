# Como rodar o app (React Native + Expo)

**Requisitos**
- Node.js >= 18.18
- Yarn 4 (via Corepack)
- Expo Go (no celular) ou emulador Android

**Configuracao da API**
1. Crie um arquivo `.env` neste diretorio.
2. Adicione `EXPO_PUBLIC_API_URL=http://localhost:3000`
3. Se for testar em celular, use o IP da sua maquina na rede, ex: `EXPO_PUBLIC_API_URL=http://192.168.0.10:3000`

**Passo a passo**
1. `corepack enable`
2. `yarn install`
3. `yarn start`

**Rodar em plataformas**
- Android (emulador ou device): `yarn android`
- Web: `yarn web`
- iOS (somente macOS): `yarn ios`
