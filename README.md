# Remote Claims Mock

Cloudflare Worker that serves mock claim data and simulates claim moves.

## Requirements

- Node.js 22 or newer
- npm

## Install

```bash
npm ci
```

## Build and check

There is no separate build output: Wrangler bundles the TypeScript Worker when it runs or deploys it. Type-check the source and validate the deploy bundle with:

```bash
npm run check
```

This runs `tsc --noEmit` followed by `wrangler deploy --dry-run`. To run only the TypeScript check, use `npm run typecheck`.

## Run locally

Start Wrangler's local Worker server:

```bash
npm run dev
```

By default, the local API is available at `http://localhost:8787`. In another terminal, try:

```bash
curl -i 'http://localhost:8787/claims?code=claim12'

curl -X POST 'http://localhost:8787/claims/move' \
  -H 'Content-Type: application/json' \
  -d '{"oldCode":"claim12","newCode":"claim13"}'

curl -X POST 'http://localhost:8787/claims/reset'
```

Move state is held in memory and is cleared when the Worker process restarts. The reset endpoint clears that state without restarting.

## Deploy

Deploy the Worker to the Cloudflare account configured for Wrangler:

```bash
npm run deploy
```

Wrangler must be authenticated to an account authorized to deploy this Worker.

## Call the deployed mock service

```bash
curl -i 'https://mock-claims.devtooling.workers.dev/claims?code=claim12'
```

## Simulate a full move

```bash
curl -X POST 'https://mock-claims.devtooling.workers.dev/claims/move' \
  -H 'Content-Type: application/json' \
  -d '{
    "oldCode": "claim12",
    "newCode": "claim13"
  }'
```

## Reset in-memory data

```bash
curl -X POST 'https://mock-claims.devtooling.workers.dev/claims/reset'
```
