#!/usr/bin/env bash
curl -sS "${API_BASE:-http://localhost:3000}/orders?page=1&pageSize=20" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
