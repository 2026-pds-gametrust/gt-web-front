# Hot Updater (OTA)

Atualizações over-the-air (OTA) self-hosted para o app React Native, usando **Cloudflare** (Worker + D1 + R2) como backend.

Documentação oficial da lib: [hot-updater.dev](https://hot-updater.dev)

---

## Visão geral

O Hot Updater permite publicar mudanças em **JavaScript/TypeScript** sem passar pela loja (App Store / Play Store), desde que a **versão nativa** do app (`expo.version` em `app.json`) continue a mesma.

| Cenário | Ação |
| --- | --- |
| Mudou só JS/TS, estilos, lógica de features | `npx hot-updater deploy` |
| Mudou plugin Expo, versão nativa, dependência nativa | Novo `expo prebuild` + novo build (`yarn android` / EAS) |
| Nova versão na loja (ex.: `1.9.4` → `2.0.0`) | Atualizar `app.json` → build nativo → deploy OTA com novo `-t` |

### Limitações — não enviar código nativo via OTA

O `npx hot-updater deploy` publica apenas o **bundle JavaScript** (Hermes). Ele **não** altera o binário instalado no dispositivo (APK/IPA).

**O que o OTA não atualiza:**

- Código Kotlin, Java, Swift ou Objective-C
- Bibliotecas `.so` / `.aar` (Android) ou frameworks / CocoaPods (iOS)
- Plugins Expo adicionados ou alterados no `app.json`
- Permissões ou configs nativas (`AndroidManifest.xml`, `Info.plist`)
- Qualquer dependência npm que inclua código nativo novo ou atualizado

**Por que o app pode crashar:** se o bundle OTA passar a usar um módulo nativo que **não existe** no build instalado, o runtime falha ao carregar (TurboModule/`NativeModules` ausente, `require()` de lib não linkada, etc.). O JS novo assume que o runtime nativo do build (`expo.version` atual) já contém tudo que precisa.

**Seguro para OTA (só JS, sem mudança nativa):**

- Telas, componentes, hooks e stores (`src/features`, `src/pages`, etc.)
- Chamadas de API, i18n, navegação — desde que as libs nativas já estivessem no build
- Estilos (NativeWind / Tailwind)
- Correções de lógica e bugs em TypeScript

**Exige novo build nativo** (`expo prebuild` + `yarn android` / `yarn ios` / EAS) **antes** de qualquer deploy OTA que dependa da mudança:

- `yarn add` / `yarn remove` de pacote com código nativo
- Alterar plugins ou permissões no `app.json`
- Atualizar Expo SDK, React Native ou libs nativas (Reanimated, Camera, Screens, etc.)
- Mudar `expo.version` para release na loja

**Regra prática:** em dúvida se a mudança é nativa, faça novo build e só depois publique OTA para essa versão.

---

## Arquitetura

```text
┌─────────────┐     deploy (CLI)      ┌──────────────────────────────┐
│ Desenvolvedor│ ───────────────────► │ Cloudflare                    │
│ hot-updater  │                       │  R2  → bundles .zip           │
└─────────────┘                       │  D1  → metadados de release   │
                                      │  Worker → check + download URL │
                                      └──────────────┬───────────────┘
                                                     │ GET /api/check-update/...
                                                     ▼
                                      ┌──────────────────────────────┐
                                      │ App nativo (HotUpdater.wrap)    │
                                      └──────────────────────────────┘
```

### Peças no projeto

| Peça | Arquivo / local |
| --- | --- |
| Cliente no app | [`App.tsx`](../App.tsx) — `HotUpdater.wrap` + [`HotUpdaterFallback`](../src/widgets/app-bootstrap/ui/hot-updater-fallback.tsx) |
| Plugin Expo (canal nativo) | [`app.json`](../app.json) — `@hot-updater/react-native`, canal `production` |
| Config do CLI (publish) | [`hot-updater.config.ts`](../hot-updater.config.ts) — build Expo + R2 + D1 |

### Infra Cloudflare (já provisionada)

| Recurso | Valor |
| --- | --- |
| Worker | `hot-updater` |
| URL pública | `https://hot-updater.eduardo-parize.workers.dev` |
| R2 (`BUCKET`) | `sauvvitech` |
| D1 (`DB`) | `sauvvitech` |
| Secret | `JWT_SECRET` |

O app usa a URL com sufixo **`/api/check-update`** (não só o domínio raiz).

---

## Variáveis de ambiente

Copiar de [`.env.example`](../.env.example) para `.env`.

### No app (embutidas no build)

| Variável | Descrição |
| --- | --- |
| `EXPO_PUBLIC_HOT_UPDATER_URL` | Base do check de update. **Deve incluir** `/api/check-update`. Ex.: `https://hot-updater.eduardo-parize.workers.dev/api/check-update`. Vazio = OTA desligado. |

> `EXPO_PUBLIC_*` vai no APK/IPA. Não colocar segredos aqui.

### Só CLI de publish (não precisa para Metro/dev)

| Variável | Descrição |
| --- | --- |
| `HOT_UPDATER_CLOUDFLARE_ACCOUNT_ID` | Account ID Cloudflare |
| `HOT_UPDATER_CLOUDFLARE_R2_BUCKET_NAME` | Nome do bucket R2 |
| `HOT_UPDATER_CLOUDFLARE_D1_DATABASE_ID` | ID do banco D1 |
| `HOT_UPDATER_CLOUDFLARE_API_TOKEN` | Token com permissão de edição em D1 e R2 (**não versionar**) |

---

## Setup inicial (referência)

O projeto já está configurado. Para um ambiente novo:

1. Dependências em [`package.json`](../package.json): `hot-updater`, `@hot-updater/cloudflare`, `@hot-updater/expo`, `@hot-updater/react-native`, `wrangler` **v4+** (upload R2 usa `--remote`).
2. Worker + D1 + R2 na Cloudflare (via dashboard ou `npx hot-updater init`).
3. Preencher `.env` com as variáveis acima.
4. `npx expo prebuild` (requer `config/google-services.json` e `config/GoogleService-Info.plist` para push).
5. Build nativo: `yarn android` ou `yarn ios` (OTA **não** funciona no Expo Go puro).

---

## Comandos

### Verificar saúde do projeto

```bash
npx hot-updater doctor
```

### Publicar update OTA (mudança só JS/TS)

Versão e canal devem bater com `app.json` (`version: 1.9.4`, canal `production`):

```bash
npx hot-updater deploy -c production -t 1.9.4 -p android
npx hot-updater deploy -c production -t 1.9.4 -p ios
```

Modo interativo (escolhe plataforma, canal, etc.):

```bash
npx hot-updater deploy -i
```

### Console web (listar / gerenciar bundles)

```bash
npx hot-updater console
```

### Build nativo (após mudança de plugin ou versão)

```bash
npx expo prebuild --clean   # se alterou app.json / plugins
yarn android                # ou yarn ios
# ou builds na nuvem:
yarn build:android          # eas build -p android --profile preview
yarn build:ios
```

### EAS — variável para builds na nuvem

```bash
eas env:create --name EXPO_PUBLIC_HOT_UPDATER_URL \
  --value "https://hot-updater.eduardo-parize.workers.dev/api/check-update" \
  --environment production
```

Repetir para `preview` se usar builds internos com OTA.

---

## Regras importantes

1. **Canal:** `-c production` no deploy = `"channel": "production"` no plugin em `app.json`.
2. **Versão alvo:** `-t 1.9.4` = `expo.version` em `app.json`. OTA só entrega para apps com essa versão nativa instalada.
3. **URL:** `EXPO_PUBLIC_HOT_UPDATER_URL` termina em `/api/check-update`. O cliente monta rotas como `/app-version/android/1.9.4/production/...`.
4. **Rebuild:** mudou `.env` com `EXPO_PUBLIC_*` → matar Metro e rodar `yarn android` / `yarn ios` de novo.
5. **Desligar OTA:** deixar `EXPO_PUBLIC_HOT_UPDATER_URL` vazio — `App.tsx` exporta o app sem `HotUpdater.wrap`.

---

## Como testar se está funcionando

### 1. Endpoint (navegador ou curl)

Abrir **só** `/api/check-update` retorna `{"error":"Not found"}` — isso é **normal**.

Teste com a rota completa:

```text
https://hot-updater.eduardo-parize.workers.dev/api/check-update/app-version/android/1.9.4/production/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000
```

Respostas esperadas:

- `"status":"UPDATE"` + `fileUrl` → há bundle OTA disponível
- `null` → sem update novo para esse cliente

### 2. No dispositivo

1. App instalado via build nativo (`yarn android`), versão **1.9.4**.
2. `EXPO_PUBLIC_HOT_UPDATER_URL` setada no `.env` usado no build.
3. Ao abrir, aparece brevemente o **logo animado Sauvvi** (`AppLoadingWidget` via `HotUpdaterFallback` em [`App.tsx`](../App.tsx)); durante o download OTA, uma barra de progresso abaixo do logo. Ver [refatoracao-ota-app-loading.md](./refatoracao-ota-app-loading.md).
4. Para ver update de forma óbvia: altere algo no JS, rode `npx hot-updater deploy -c production -t 1.9.4 -p android`, feche e reabra o app.

---

## Troubleshooting

| Problema | Causa / solução |
| --- | --- |
| `{"error":"Not found"}` na URL base | Normal. Use a rota `/app-version/...` ou teste pelo app. |
| `npx hot-updater init` falha com `ERESOLVE` | Infra já existe; ignorar. Ou `npm config set legacy-peer-deps true` temporariamente. |
| Upload R2: `Unknown argument: remote` | Atualizar `wrangler` para v4+ (`package.json`). |
| Android: `RNScreensPackage` not found | `cd android && ./gradlew clean`, apagar `android/app/build`, rebuild sem cache. |
| OTA não aparece no app | Bundle embutido já é o mais recente; publique novo deploy e reabra o app. |
| `hot-updater db migrate` falha | Com Cloudflare Worker, migrations já aplicadas no deploy do Worker; usar deploy CLI normalmente. |

---

## Referências

- [App.tsx](../App.tsx)
- [hot-updater.config.ts](../hot-updater.config.ts)
- [app.json](../app.json)
- [README — variáveis de ambiente](../README.md)
