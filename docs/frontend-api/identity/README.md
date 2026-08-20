# Domínio: identity

## Ganho no produto

Identidade e perfil ancoram ownership, verificação de conta e endereços — pré-requisito de confiança. Conta de marketplace (User) não guarda senha; sessão vem de /auth/*.

## Endpoints (12)

| Método | Path | Resumo | Contrato |
|--------|------|--------|----------|
| `GET` | `/profiles` | List profiles | [abrir](./profiles/get-profiles/) |
| `POST` | `/profiles` | Create a profile | [abrir](./profiles/post-profiles/) |
| `GET` | `/profiles/{id}` | Get profile by id | [abrir](./profiles/get-profiles-by-id/) |
| `PUT` | `/profiles/{id}` | Update profile by id | [abrir](./profiles/put-profiles-by-id/) |
| `GET` | `/profiles/by-user/{userId}` | Get profile by user id | [abrir](./profiles/get-profiles-by-user-by-userId/) |
| `GET` | `/users` | Get all users | [abrir](./users/get-users/) |
| `POST` | `/users` | Create a new user | [abrir](./users/post-users/) |
| `DELETE` | `/users/{id}` | Delete a user | [abrir](./users/delete-users-by-id/) |
| `GET` | `/users/{id}` | Get a user by ID | [abrir](./users/get-users-by-id/) |
| `PUT` | `/users/{id}` | Update a user | [abrir](./users/put-users-by-id/) |
| `PUT` | `/users/{id}/groups` | Assign user groups (ADMIN only) | [abrir](./users/put-users-by-id-groups/) |
| `POST` | `/users/{id}/verify` | Verify a user identity | [abrir](./users/post-users-by-id-verify/) |

## Recursos

- [`profiles/`](./profiles/)
- [`users/`](./users/)
