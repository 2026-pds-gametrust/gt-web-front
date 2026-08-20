#!/usr/bin/env bash
# List verification cases
curl -X GET 'http://localhost:3000/verification-cases' \
  -H 'Accept: application/json'
