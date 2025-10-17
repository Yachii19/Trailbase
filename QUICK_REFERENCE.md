# ⚡ SkillSync Pro - Quick Reference Card

## 🚀 Start Commands

```bash
# Backend
cd backend && npm run dev          # http://localhost:5000

# Frontend  
npm run dev                        # http://localhost:3000

# MongoDB
mongod                             # Local MongoDB

# Deploy Contracts
cd contracts
npx hardhat run scripts/deploy.js --network baseSepolia
```

---

## 📍 Key Files

| Component | Location |
|-----------|----------|
| Certificate Contract | `contracts/VeriScribeCertificate.sol` |
| Gig Escrow Contract | `contracts/SkillSyncGigEscrow.sol` |
| Contract ABIs | `src/lib/contracts.ts` |
| Backend Server | `backend/server.js` |
| User Model | `backend/models/User.js` |
| Gig API | `backend/routes/gigs.js` |
| VeriScribe Module | `src/components/modules/VeriScribeModule.tsx` |
| SkillSync Module | `src/components/modules/SkillSyncModule.tsx` |

---

## 🔑 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GIG_ESCROW_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/skillsync
PORT=5000
CORS_ORIGIN=http://localhost:3000
CERTIFICATE_CONTRACT_ADDRESS=0x...
GIG_ESCROW_CONTRACT_ADDRESS=0x...
```

---

## 🔗 Contract Functions

### VeriScribeCertificate
```solidity
// Verify institution (admin only)
addVerifiedInstitution(address institution)

// Mint certificate NFT
mintCertificate(
  address student,
  string institutionName,
  string courseName,
  string certificateType,
  string metadataURI
) returns (uint256 tokenId)

// Check verification
verifiedInstitutions(address) returns (bool)

// Get certificate
getCertificate(tokenId) returns (CertificateData)
```

### SkillSyncGigEscrow
```solidity
// Post gig (requires USDC approval first)
postGig(
  string title,
  string description,
  uint256 amount,
  uint256 deadline
) returns (uint256 gigId)

// Accept gig
acceptGig(uint256 gigId)

// Release payment & mint POW NFT (single tx!)
releasePayment(uint256 gigId, string metadataURI)

// Cancel and refund
cancelGig(uint256 gigId)
```

---

## 📡 API Endpoints

### Users
```
GET    /api/users/:walletAddress          Get/create user
PUT    /api/users/:walletAddress          Update profile
GET    /api/users/:walletAddress/stats    Get user stats
```

### Gigs
```
GET    /api/gigs                           List gigs
GET    /api/gigs/:gigId                    Get gig
POST   /api/gigs                           Create gig metadata
POST   /api/gigs/:gigId/accept             Mark accepted
POST   /api/gigs/:gigId/complete           Mark completed
POST   /api/gigs/:gigId/messages           Add message
```

### Certificates
```
GET    /api/certificates                   List certificates
GET    /api/certificates/:tokenId          Get certificate
POST   /api/certificates                   Create certificate
GET    /api/certificates/verify/:tokenId   Verify certificate
POST   /api/certificates/:tokenId/revoke   Revoke certificate
```

### Institutions
```
GET    /api/institutions                   List institutions
GET    /api/institutions/:address          Get institution
POST   /api/institutions/verify            Submit verification
POST   /api/institutions/:address/approve  Approve (admin)
POST   /api/institutions/:address/reject   Reject (admin)
```

---

## 🔄 Typical Workflows

### Issue Certificate
```
1. Institution requests verification (POST /api/institutions/verify)
2. Admin approves (Smart Contract: addVerifiedInstitution)
3. Sync to DB (POST /api/institutions/:address/on-chain)
4. Institution mints certificate (Smart Contract: mintCertificate)
5. Save metadata (POST /api/certificates)
```

### Complete Gig
```
1. Client approves USDC (USDC.approve)
2. Client posts gig (Smart Contract: postGig)
3. Save metadata (POST /api/gigs)
4. Freelancer accepts (Smart Contract: acceptGig)
5. Update DB (POST /api/gigs/:gigId/accept)
6. Client releases payment (Smart Contract: releasePayment)
   → Transfers USDC
   → Mints POW NFT
7. Update DB (POST /api/gigs/:gigId/complete)
```

---

## 🛠️ Useful Commands

```bash
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Restart TypeScript server
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Check MongoDB connection
mongosh
use skillsync
show collections

# Test API endpoint
curl http://localhost:5000/api/health

# Deploy contracts
npx hardhat run scripts/deploy.js --network baseSepolia

# Verify contract on BaseScan
npx hardhat verify --network baseSepolia ADDRESS CONSTRUCTOR_ARGS
```

---

## 🎨 USDC Utilities

```typescript
import { parseUSDC, formatUSDC } from '@/lib/contracts';

// Convert UI amount to contract format
const amount = parseUSDC("100.50");  // → 100500000n

// Convert contract amount to UI
const display = formatUSDC(100500000n);  // → "100.50"
```

---

## 📊 Contract Addresses

### Base Mainnet
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Certificate**: (Deploy your contract)
- **Gig Escrow**: (Deploy your contract)

### Base Sepolia
- **USDC**: (Get from faucet)
- **Certificate**: (Deploy for testing)
- **Gig Escrow**: (Deploy for testing)

---

## 🔍 Debug Checklist

**Transaction Failing?**
- [ ] Wallet on Base network?
- [ ] Enough ETH for gas?
- [ ] Contract addresses correct?
- [ ] USDC approved (for gigs)?
- [ ] Institution verified (for certificates)?

**Backend Error?**
- [ ] MongoDB running?
- [ ] .env file configured?
- [ ] CORS allows frontend?
- [ ] All dependencies installed?

**Frontend Issue?**
- [ ] npm install complete?
- [ ] .env.local set?
- [ ] contracts.ts updated?
- [ ] .next cache cleared?

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README_COMPLETE.md` | Complete project overview |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment |
| `PROJECT_STRUCTURE.md` | Architecture documentation |
| `INTEGRATION_SUMMARY.md` | What was built & how |
| `QUICK_REFERENCE.md` | This file |

---

## 🎯 Testing Checklist

- [ ] Deploy contracts to Base Sepolia
- [ ] Start MongoDB locally
- [ ] Start backend (port 5000)
- [ ] Start frontend (port 3000)
- [ ] Connect wallet to Base
- [ ] Request institution verification
- [ ] Approve institution (admin)
- [ ] Issue certificate NFT
- [ ] Get test USDC
- [ ] Post a gig
- [ ] Accept gig (different wallet)
- [ ] Complete gig (check POW NFT minted)
- [ ] Verify all data in MongoDB

---

## 💡 Pro Tips

1. **Use Base Sepolia first** - Test everything before mainnet
2. **Check BaseScan** - Verify all transactions
3. **Monitor events** - Watch contract events for debugging
4. **Keep private keys safe** - Never commit to Git
5. **Use MongoDB Atlas** - For production deployment
6. **Enable 2FA** - On all services
7. **Set up monitoring** - Sentry, Datadog, etc.
8. **Rate limit API** - Prevent abuse
9. **Back up MongoDB** - Regularly
10. **Audit contracts** - Before mainnet launch

---

## 🚀 Go Live Checklist

- [ ] Audit smart contracts
- [ ] Deploy to Base Mainnet
- [ ] Verify on BaseScan
- [ ] Deploy backend to Railway/Render
- [ ] Set up MongoDB Atlas
- [ ] Deploy frontend to Vercel
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Add monitoring/analytics
- [ ] Test all flows end-to-end
- [ ] Prepare launch announcement

---

**Need Help?** Check the full documentation files!

**Ready to Deploy?** Start with `DEPLOYMENT_GUIDE.md`

---

Built with ❤️ on Base 🔵
