#!/usr/bin/env bash
curl -sS -X POST "${API_BASE:-http://localhost:3000}/orders" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"listingId":"LISTING_ID","shippingMode":"PICKUP"}'
