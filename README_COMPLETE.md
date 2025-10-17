# 🎓 SkillSync Pro - Complete Web3 Verification Platform

A unified platform for academic verification and freelance gig management on Base blockchain, featuring NFT certificates, USDC escrow, and verifiable career records.

---

## 🌟 Features

### VeriScribe Module (Academic Verification)
- ✅ NFT-based soulbound certificates
- ✅ Institution verification system
- ✅ Admin approval workflow
- ✅ Immutable credential records
- ✅ On-chain verification

### SkillSync Module (Gig & Experience Verification)
- ✅ USDC escrow for secure payments
- ✅ Automated gig lifecycle management
- ✅ Proof-of-Work NFT minting on completion
- ✅ Client-freelancer matching
- ✅ Platform fee management (2% default)

### Unified Platform
- ✅ Single wallet identity for all actions
- ✅ Comprehensive career portfolio (academic + professional)
- ✅ MongoDB for off-chain metadata
- ✅ Real-time blockchain synchronization

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  VeriScribe  │  │  SkillSync   │  │ Certificate  │     │
│  │    Module    │  │    Module    │  │    Viewer    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                           │                                 │
│                   Wagmi + Viem + OnchainKit                 │
└────────────────────────────┬────────────────────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────┐              ┌──────────▼──────────┐
│   Base Blockchain  │              │  Backend (Node.js)  │
│                    │              │                     │
│  ┌──────────────┐  │              │  ┌──────────────┐  │
│  │ Certificate  │  │◄────────────►│  │   MongoDB    │  │
│  │  Contract    │  │              │  │   Database   │  │
│  └──────────────┘  │              │  └──────────────┘  │
│                    │              │                     │
│  ┌──────────────┐  │              │  API Routes:        │
│  │ Gig Escrow   │  │              │  - Users            │
│  │  Contract    │  │              │  - Gigs             │
│  └──────────────┘  │              │  - Certificates     │
│                    │              │  - Institutions     │
│  ┌──────────────┐  │              │  - Metadata         │
│  │ USDC Token   │  │              └─────────────────────┘
│  │  Contract    │  │
│  └──────────────┘  │
└────────────────────┘
```

---

## 📁 Project Structure

```
SkillSync Pro/
├── contracts/                          # Solidity smart contracts
│   ├── VeriScribeCertificate.sol      # ERC-721 Soulbound NFT
│   ├── SkillSyncGigEscrow.sol         # Gig escrow + POW NFT
│   └── hardhat.config.js              # Deployment configuration
│
├── backend/                            # Node.js + Express API
│   ├── models/                        # MongoDB schemas
│   │   ├── User.js
│   │   ├── Gig.js
│   │   ├── Certificate.js
│   │   └── Institution.js
│   ├── routes/                        # API endpoints
│   │   ├── users.js
│   │   ├── gigs.js
│   │   ├── certificates.js
│   │   ├── institutions.js
│   │   └── metadata.js
│   ├── server.js                      # Express server
│   └── package.json
│
├── src/                                # Next.js frontend
│   ├── app/                           # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── modules/                   # Feature modules
│   │   │   ├── VeriScribeModule.tsx
│   │   │   ├── SkillSyncModule.tsx
│   │   │   └── CertificateViewer.tsx
│   │   ├── ui/                        # shadcn/ui components
│   │   └── verification/
│   │       ├── AdminPanel.tsx
│   │       └── VerificationRequestForm.tsx
│   └── lib/
│       ├── contracts.ts               # Contract ABIs & config
│       ├── utils.ts
│       └── verification.ts
│
├── DEPLOYMENT_GUIDE.md                 # Complete deployment guide
├── PROJECT_STRUCTURE.md                # Architecture documentation
├── README.md                           # This file
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourrepo/skillsync-pro
cd skillsync-pro
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Setup Environment Variables

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_GIG_ESCROW_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (`backend/.env`):**
```env
MONGODB_URI=mongodb://localhost:27017/skillsync
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud)
```

### 5. Start Backend
```bash
cd backend
npm run dev
```

### 6. Start Frontend
```bash
npm run dev
```

### 7. Deploy Smart Contracts

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 💡 Key Workflows

### Issue Academic Certificate

1. **Institution Submits Verification Request**
   ```
   Frontend → Backend API → MongoDB
   ```

2. **Admin Approves Institution**
   ```
   Admin Panel → Smart Contract → On-Chain Verification
   ```

3. **Institution Issues Certificate**
   ```
   Fill Form → Generate Metadata → Mint NFT → Update DB
   ```
   **Blockchain Transaction:**
   ```solidity
   mintCertificate(studentAddress, institutionName, courseName, type, metadataURI)
   → CertificateIssued Event
   → Non-transferable NFT minted
   ```

### Post & Complete Gig

1. **Client Posts Gig**
   ```
   Fill Gig Form → Approve USDC → Post Gig → USDC Escrowed
   ```
   **Blockchain Transactions:**
   ```solidity
   // 1. Approve USDC
   USDC.approve(GigEscrowContract, amount)
   
   // 2. Post gig
   postGig(title, description, amount, deadline)
   → USDC locked in contract
   → GigPosted Event
   ```

2. **Freelancer Accepts Gig**
   ```
   Browse Gigs → Accept → Status: Accepted
   ```

3. **Client Releases Payment**
   ```
   Review Work → Release Payment → Dual Action
   ```
   **Single Blockchain Transaction:**
   ```solidity
   releasePayment(gigId, metadataURI)
   → Transfer USDC to freelancer
   → Mint Proof-of-Work NFT
   → GigCompleted + ProofOfWorkMinted Events
   ```

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: 
  - OnchainKit 0.38.17
  - Wagmi 2.18.1
  - Viem 2.38.2
- **State Management**: React hooks + Wagmi hooks

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.18
- **Database**: MongoDB + Mongoose
- **Utilities**: CORS, Helmet, Morgan, Compression

### Blockchain
- **Network**: Base (EVM-compatible)
- **Contracts**: Solidity 0.8.20 + OpenZeppelin
- **Token Standard**: ERC-721 (Soulbound NFTs)
- **Payment**: USDC (ERC-20)

---

## 📊 Smart Contracts

### VeriScribeCertificate.sol
**Purpose:** Issue non-transferable academic certificates as NFTs

**Key Functions:**
- `addVerifiedInstitution(address)` - Verify institution (admin only)
- `mintCertificate(...)` - Issue certificate NFT
- `getCertificate(tokenId)` - Retrieve certificate data
- `revokeCertificate(tokenId)` - Invalidate certificate

**Security:**
- Soulbound (non-transferable)
- Only verified institutions can mint
- Owner can revoke institution status

### SkillSyncGigEscrow.sol
**Purpose:** Manage gigs with USDC escrow and POW NFT minting

**Key Functions:**
- `postGig(...)` - Create gig with USDC escrow
- `acceptGig(gigId)` - Freelancer accepts gig
- `releasePayment(gigId, metadataURI)` - Pay + mint NFT
- `cancelGig(gigId)` - Cancel and refund

**Security:**
- ReentrancyGuard protection
- Platform fee (2%, adjustable by owner)
- USDC held in escrow until completion

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  walletAddress: String (unique, indexed),
  userType: ['student', 'freelancer', 'client', 'institution'],
  profile: { name, email, bio, skills, ... },
  institutionData: { ... },
  stats: {
    certificatesIssued: Number,
    certificatesReceived: Number,
    gigsCompleted: Number,
    totalEarned: Number,
    ...
  }
}
```

### Gig Collection
```javascript
{
  gigId: Number (unique, from blockchain),
  client: String,
  freelancer: String,
  title: String,
  description: String,
  amount: Number,
  status: ['open', 'accepted', 'completed', 'disputed', 'cancelled'],
  proofTokenId: Number,
  transactionHash: String,
  ...
}
```

### Certificate Collection
```javascript
{
  tokenId: Number (unique, from blockchain),
  student: String,
  institution: String,
  courseName: String,
  certificateType: String,
  metadata: { ... },
  isValid: Boolean,
  ...
}
```

---

## 🔐 Security Features

- ✅ Soulbound NFTs (non-transferable)
- ✅ Institution verification system
- ✅ USDC escrow protection
- ✅ Reentrancy guards
- ✅ Input validation
- ✅ Admin role separation
- ✅ Event logging for transparency

---

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup instructions
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Architecture details
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Component checklist

---

## 🧪 Testing

### Test Contracts
```bash
cd contracts
npx hardhat test
```

### Test Backend
```bash
cd backend
npm test
```

### Manual Testing
1. Connect wallet to Base Sepolia testnet
2. Get test USDC from faucet
3. Follow workflows in "Key Workflows" section

---

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Smart contract deployment to Base
- Backend deployment to Railway/Render
- Frontend deployment to Vercel
- Production configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file

---

## 🆘 Support

- **Documentation**: Check all .md files
- **Issues**: Open GitHub issue
- **Discord**: [Your Discord Server]
- **Email**: support@skillsyncpro.com

---

## 🎯 Roadmap

- [ ] Multi-chain support (Optimism, Arbitrum)
- [ ] Dispute resolution system
- [ ] Reputation scoring
- [ ] Skill endorsements
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with LinkedIn
- [ ] DAO governance for platform fees

---

## 👥 Team

Built for [Hackathon Name]

---

**Live Demo:** https://skillsync-pro.vercel.app  
**Contracts:** https://basescan.org/address/0x...  
**GitHub:** https://github.com/yourrepo/skillsync-pro

---

Made with ❤️ on Base 🔵
