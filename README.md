# LATEO

**Remain unseen. Stay connected.**

LATEO is an open-source, privacy-first anonymous messaging project. This repository is an initial foundation—not a production-ready secure messenger.

## Current foundation
- `apps/mobile`: Expo + React Native + TypeScript starter UI
- `backend`: Rust/Axum API starter with health endpoint
- `infrastructure/local`: PostgreSQL and Redis for local development
- `docs`: product and architecture foundations

## Requirements
- Node.js 22.13+ (Node 24 is fine)
- pnpm
- Rust stable
- Docker Desktop
- iPhone with Expo Go (for the initial UI prototype)

## Mobile setup
```bash
pnpm install
pnpm mobile
```
Install Expo Go on your iPhone. Ensure your Mac and iPhone are on the same Wi-Fi, then scan the QR code displayed by Expo.

If LAN discovery fails:
```bash
pnpm mobile:tunnel
```

## Backend setup
```bash
cd backend
cargo run -p lateo-api
```
Health endpoint:
```bash
curl http://localhost:3000/health
```

## Local infrastructure
From the repository root:
```bash
docker compose -f infrastructure/local/docker-compose.yml up -d
```

## Important security status
No end-to-end encryption, secure identity protocol, abuse reporting, or production authentication is implemented yet. Do not use this prototype for sensitive communication. We will integrate audited cryptographic implementations and conduct security reviews before claiming security.
