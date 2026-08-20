# Sessão, tokens e headers

Como o frontend web deve autenticar contra o gt-backend. Persona: **qualquer usuário logado** (Lucas/Carlos). Contraste: **ADMIN/Camila** (mesmos tokens, groups diferentes no JWT).

Contratos: [auth/](./auth/). Schema da sessão: [`AuthSession`](./_schemas/AuthSession.md).

---

## Modelo

Não há Cognito, cookie de sessão nem IdP. O backend emite:

| Token | Formato | Onde vive no client | TTL (conceito) |
|-------|---------|---------------------|----------------|
| `accessToken` | JWT (claims: sub, groups, `sid`, exp) | memória + storage; header `Authorization: Bearer` | curto |
| `refreshToken` | opaco (não JWT) | storage; **somente** body de `POST /auth/refresh` | mais longo; rotaciona a cada uso |

`User` **não** inclui password. Credenciais ficam num módulo de identity no servidor.

```json
{
  "user": { "id": "user-carlos-1", "groups": ["app-user"], "status": "ACTIVE" },
  "accessToken": "eyJ...",
  "refreshToken": "rt_..."
}
```

---

## Endpoints de sessão

| Método | Path | Auth HTTP | Sucesso | Contrato |
|--------|------|-----------|---------|----------|
| `POST` | `/auth/register` | público | **201** `AuthSession` | [abrir](./auth/auth/post-auth-register/) |
| `POST` | `/auth/login` | público | **200** `AuthSession` | [abrir](./auth/auth/post-auth-login/) |
| `POST` | `/auth/refresh` | público (token no body) | **200** `AuthSession` | [abrir](./auth/auth/post-auth-refresh/) |
| `POST` | `/auth/logout` | **Bearer** | **204** vazio | [abrir](./auth/auth/post-auth-logout/) |
| `GET` | `/auth/me` | **Bearer** | **200** `User` | [abrir](./auth/auth/get-auth-me/) |

### Register — casos

**Sucesso 201:** criar User + hash de senha (servidor) + group `app-user` + sessão.

**400 `FIELD_INVALID`:** payload inválido **ou** e-mail/CPF duplicado. Copy **uniforme** — não confirmar existência.

**400 `USER_UNDERAGE`:** `birthDate` abaixo da idade mínima.

**429:** mais de 20 tentativas / 15 min / IP (register, login e refresh compartilham o limiter). Body típico:

```json
{ "message": "Too many requests, please try again later." }
```

### Login — casos

**200:** sessão. **401 `AUTH_INVALID_CREDENTIALS`:** e-mail inexistente, senha errada, usuário sem credencial, **ou** `BLOCKED`. Uma copy só.

User `PENDING_VERIFICATION` pode logar (não é BLOCKED); não inventar bloqueio na UI.

### Refresh — casos

**200:** novo par de tokens; **descartar** o refresh antigo.

**401:** refresh desconhecido, expirado, já revogado, **reuso** (ataque: a família da sessão é derrubada), ou user BLOCKED.

Não enviar o access JWT no refresh (não é Bearer).

### Logout — casos

**204:** esta sessão morre: refresh revogado **e** access invalidado **na hora** (`sid` + `accessInvalidatedAt` no servidor). Outras sessões (outro browser) seguem.

Chamar logout **sem** Bearer → **401**. Não tem body de sucesso: `if (res.status === 204)`.

Depois do logout, o mesmo access em `GET /auth/me` → 401. Não tentar refresh com o token antigo dessa sessão.

### /auth/me — casos

**200** User. **401** token ruim/expirado/revogado. **404** user removido → logout local.

---

## Interceptor HTTP (front)

Ordem sugerida no `httpClient`:

1. Anexar `Authorization: Bearer ${accessToken}` em rotas que não são públicas (ver [04-matriz-autorizacao.md](./04-matriz-autorizacao.md)).
2. Em **401** de rota Bearer: **uma** tentativa de `POST /auth/refresh`; se 200, repetir o request; se 401/429, limpar sessão e ir ao login.
3. Não retry infinito. Não retry em 403 (permissão) nem em 400.
4. 429 de `/auth/*`: backoff; não vazar e-mail na copy.
5. Nunca logar tokens, CPF, Authorization.

Rotas públicas (`security: []` no OpenAPI): register, login, refresh, GETs de discovery (categorias, produtos, listings, search, seals GET, trust GET, media HTTP, etc.). Logout e `/me` **não** são públicos.

---

## Headers

| Header | Obrigatório? | Valor |
|--------|----------------|-------|
| `Accept` | sempre | `application/json` |
| `Content-Type` | POST/PUT com JSON | `application/json` |
| `Authorization` | rotas com `bearerAuth` | `Bearer <accessToken>` |

### O que **não** enviar como identidade

O OpenAPI ainda declara parâmetros `XUserIdHeader` / `XUserGroupsHeader` em alguns paths (legado). O middleware **ignora** spoof: o ator sai só do JWT verificado. Groups podem ser **espelhados internamente** para `authorizeByGroup` — o client não precisa (e não deve) mandar `x-user-groups`.

`VITE_DEV_USER_ID` no frontend **não** autentica. Em modo real, use `VITE_DEV_ACCESS_TOKEN` (JWT emitido por register/login).

---

## Groups no JWT (não são papéis buyer/seller)

| Valor | Quem |
|-------|------|
| `app-user` | Carlos, Lucas (padrão no register) |
| `partner` | parceiro |
| `backoffice` | Camila |
| `admin` | administração |
| `SYSTEM` | **não** atribuível via HTTP |

Auto-escalada é recusada: ADMIN não usa `PUT /users/{id}/groups` em si mesmo para se promover de formas ilegais; `SYSTEM` não entra pelo app.

O produto GamerTrust distingue **comprador/vendedor** na jornada, mas a API HTTP só conhece esses groups. Um `app-user` vende (`POST /listings` com `sellerId` = próprio id) e compra (favoritos, busca).

---

## Relação com outras rotas

```text
accessToken válido
    ├── GET /auth/me
    ├── POST /profiles, POST /listings, POST /favorites, ...
    ├── POST /auth/logout  → invalida ESTE access
    └── 401 → POST /auth/refresh → novo access
```

Mass assignment: nunca `JSON.stringify(form)` cego em `PUT /users/{id}` — o dono **não** persiste `verified` / `status` mesmo que o client envie.

---

## Checklist de implementação web

- [ ] Persistência de dois tokens; refresh nunca vai no header
- [ ] Logout trata 204 sem `res.json()`
- [ ] Duplicata de cadastro = 400 genérico
- [ ] Login falho = 401 genérico
- [ ] Sem `x-user-*` de identidade
- [ ] 403 ≠ 401 (403 = logado sem permissão; não “desloga” por engano)
- [ ] User BLOCKED não “entra” (401 no login/refresh)
