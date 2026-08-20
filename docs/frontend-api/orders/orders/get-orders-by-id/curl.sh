#!/usr/bin/env bash
curl -sS "${API_BASE:-http://localhost:3000}/orders/${ORDER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
