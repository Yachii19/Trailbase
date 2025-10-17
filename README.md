# TrailBase

TrailBase is a demo platform for issuing verifiable digital certificates and managing freelance gigs that use on-chain escrow. The frontend demonstrates wallet-integrated UX (OnchainKit + Wagmi), smart contract interactions, and a verification workflow for institutions and freelancers.

This README is a concise guide for using, developing, and deploying the frontend application.

## What this app does
- Issue and view certificates (VeriScribe module)
- Post and accept gigs with USDC escrow and proof-of-work tokens (SkillSync module)
- Simple admin workflow for approving institution verification requests
- Integrates wallet connection and on-chain transactions via OnchainKit and Wagmi

## Quick start (local development)
Prerequisites:
- Node.js >= 18
- npm

1. Clone the repo and install dependencies:

```powershell
cd "d:\Desktop\Programming Projects\Hackaton\TrailBase"
npm install --legacy-peer-deps
```

2. Create a local environment file (copy and edit `backend/.env` safely):

```powershell
copy backend\.env backend\.env.local
# Edit backend\.env.local and add your MONGODB_URI and any needed keys
```

3. Run the dev server:

```powershell
npm run dev
```

Open http://localhost:3000 (or the printed port) to view the app.

## Build for production (local test)

```powershell
npm run build
npm start
```

## Deploying to Vercel
1. Push your repository to GitHub.
2. Go to https://vercel.com and import the repository.
3. When configuring the project, set:
   - Framework: Next.js (auto-detected)
   - Install Command: `npm install --legacy-peer-deps` (only if you need legacy peer deps)
   - Build Command: `npm run build`
4. Add environment variables in Vercel (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` — URL of your backend API (if used)
   - `NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS` — contract address (optional)
   - `NEXT_PUBLIC_GIG_ESCROW_CONTRACT_ADDRESS` — contract address (optional)

Do NOT add private backend keys (like `DEPLOYER_PRIVATE_KEY` or `ADMIN_PRIVATE_KEY`) as public frontend environment variables.

## Important files and where to look
- `src/app/providers.tsx` — OnchainKit provider & global wrappers
- `src/lib/contracts.ts` — Contract ABIs, addresses, and helper types
- `src/components/modules/VeriScribeModule.tsx` — Certificate issuance UI
- `src/components/modules/SkillSyncModule.tsx` — Gig posting/accepting UI
- `backend/` — Express API and contract scripts (server-side)

## Notes & troubleshooting
- If a build fails due to a missing module, try cleaning and reinstalling:

```powershell
Remove-Item -Recurse -Force node_modules .next
npm install --legacy-peer-deps
npm run build
```

- If secrets were accidentally committed, remove them from git and rotate keys.

## Contributing and development
- Follow the repo's code conventions and TypeScript types in `src/lib`.
- For frontend-only changes, focus under `src/`.
- For backend or contract deployment, check the `backend/` and `contracts/` folders and associated README files.

## License
This project is provided as-is for demo and educational purposes.

