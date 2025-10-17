# TrailBase MVP - Project Structure

## 📁 Folder Structure

```
TrailBase/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home page
│   │   ├── providers.tsx           # OnchainKit provider wrapper
│   │   ├── globals.css             # Global styles with Tailwind
│   │   ├── api/                    # API routes (if needed)
│   │   ├── fonts/                  # Custom fonts
│   │   └── types/                  # App-specific types
│   │
│   ├── components/                  # React components
│   │   ├── ForecasterWrapper.tsx   # Farcaster SDK wrapper
│   │   │
│   │   ├── modules/                # Feature modules
│   │   │   ├── VeriScribeModule.tsx        # Academic verification
│   │   │   ├── SkillSyncModule.tsx         # Gig verification
│   │   │   └── CertificateViewer.tsx       # Certificate display
│   │   │
│   │   ├── ui/                     # Reusable UI components (shadcn/ui)
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   │
│   │   └── verification/           # Verification-specific components
│   │       ├── AdminPanel.tsx              # Admin verification panel
│   │       └── VerificationRequestForm.tsx # Institution request form
│   │
│   └── lib/                        # Utility libraries
│       ├── contracts.ts            # Smart contract ABIs & addresses
│       ├── logger.ts               # Logging utility
│       ├── utils.ts                # General utilities (cn, etc.)
│       └── verification.ts         # Verification logic & storage
│
├── .next/                          # Next.js build output (generated)
├── node_modules/                   # Dependencies (generated)
│
├── next.config.js                  # Next.js configuration
├── package.json                    # Project dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## 🎯 Component Architecture

### App Layer (`src/app/`)
- **layout.tsx**: Root layout that wraps the entire app with providers
- **page.tsx**: Main landing page with module navigation
- **providers.tsx**: OnchainKit configuration for Base blockchain
- **globals.css**: Global styles with CSS variables for theming

### Component Layer (`src/components/`)

#### Core Wrappers
- **ForecasterWrapper.tsx**: Initializes Farcaster SDK for frame integration

#### Feature Modules (`modules/`)
1. **VeriScribeModule**: Academic & Skills Verification
   - Issue certificates for courses, degrees, skills
   - Institution verification system
   - Admin panel for approving institutions
   
2. **SkillSyncModule**: Freelance Gig & Experience Verification
   - Gig escrow with USDC
   - Skill verification NFTs
   - Payment and completion tracking

3. **CertificateViewer**: Display and verify certificates
   - View issued certificates
   - Verify authenticity
   - Download/share certificates

#### UI Components (`ui/`)
All components follow shadcn/ui patterns:
- **Form inputs**: input, textarea, label, select
- **Layout**: card, tabs, dialog
- **Feedback**: alert, badge, button

#### Verification System (`verification/`)
- **VerificationRequestForm**: Institutions request verification
- **AdminPanel**: Admin interface to approve/reject institutions

### Library Layer (`src/lib/`)
- **contracts.ts**: Smart contract addresses, ABIs, and type definitions
- **verification.ts**: Institution verification logic and local storage
- **utils.ts**: Common utilities (cn for className merging)
- **logger.ts**: Logging and debugging utilities

## 🔧 Key Technologies

- **Framework**: Next.js 15.3.4 (App Router)
- **Blockchain**: Base (via OnchainKit & Wagmi)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React hooks + Wagmi hooks
- **Mini App**: Farcaster SDK
- **Smart Contracts**: Viem for contract interactions

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Module Descriptions

### VeriScribe (Academic Verification)
- **Purpose**: Issue blockchain-verified academic certificates
- **Features**:
  - Institution verification system
  - Certificate issuance via smart contracts
  - NFT-based certificates with metadata
  - Admin controls for institution approval

### SkillSync (Gig Verification)
- **Purpose**: Verify freelance work and skills
- **Features**:
  - USDC escrow for gig payments
  - Skill verification NFTs
  - Completion certificates
  - Dispute resolution

### Certificate Viewer
- **Purpose**: View and verify all certificates
- **Features**:
  - Display academic and skill certificates
  - Verify on-chain authenticity
  - Export/share capabilities

## 🔐 Smart Contracts

Contracts are defined in `src/lib/contracts.ts`:
- **Certificate Contract**: Manages academic certificates
- **Gig Contract**: Handles freelance verification
- **Base Sepolia Testnet**: Current deployment network

## 🎨 Styling System

Uses Tailwind CSS with shadcn/ui design system:
- CSS variables in `globals.css` for theming
- Light/dark mode support
- Consistent design tokens
- Responsive by default

## 📦 Dependencies

Key packages:
- `@coinbase/onchainkit`: Base blockchain integration
- `@farcaster/miniapp-sdk`: Farcaster frame support
- `wagmi`: Ethereum interactions
- `viem`: Contract ABI encoding/decoding
- `@radix-ui/*`: Headless UI primitives
- `tailwindcss`: Utility-first CSS
- `lucide-react`: Icon library

## 🛠️ Development Notes

### Adding New UI Components
```bash
# Use shadcn CLI to add components
npx shadcn@latest add [component-name]
```

### File Naming Conventions
- Components: PascalCase (e.g., `VeriScribeModule.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Config files: kebab-case (e.g., `tailwind.config.js`)

### Import Aliases
- `@/components/*`: Components directory
- `@/lib/*`: Library utilities
- `@/app/*`: App directory

## 🔍 Troubleshooting

### Module Resolution Issues
If you see "Module not found" errors:
1. Check `tsconfig.json` has proper path aliases
2. Restart TypeScript server in VS Code
3. Delete `.next` folder and rebuild

### Styling Not Applied
1. Verify Tailwind config includes all content paths
2. Check `globals.css` is imported in `layout.tsx`
3. Ensure PostCSS config exports `plugins` object

### Smart Contract Errors
1. Verify contract addresses in `lib/contracts.ts`
2. Check wallet is connected to Base network
3. Ensure sufficient gas for transactions

## 📄 License

This project is part of the TrailBase MVP hackathon submission.
