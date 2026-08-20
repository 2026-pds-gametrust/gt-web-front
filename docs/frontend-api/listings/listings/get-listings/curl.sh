#!/usr/bin/env bash
# List listings
curl -X GET 'http://localhost:3000/listings' \
  -H 'Accept: application/json'
