# Contrato de saída — Rebuild search_documents for PUBLISHED listings and synonym projections from taxonomy

**HTTP 200** — Reconciliation counts

**Schema OpenAPI:** `SearchReconcileResult`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `listingsReindexed` | integer | sim | Count of PUBLISHED listings successfully upserted into search_documents |
| `synonymsUpserted` | integer | sim | Count of taxonomy terms upserted into synonyms projection |

**Exemplo:**

```json
{
  "listingsReindexed": 0,
  "synonymsUpserted": 0
}
```

## Erros documentados

- **401** — Unauthorized
- **403** — Forbidden
