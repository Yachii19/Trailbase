// Institution Verification System for TrailBase

export interface InstitutionVerificationRequest {
  id: string;
  walletAddress: string;
  institutionName: string;
  institutionType: 'university' | 'college' | 'training-center' | 'bootcamp' | 'other';
  registrationNumber: string;
  website: string;
  contactEmail: string;
  officialDocumentUrl: string; // Link to proof document
  description: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface VerifiedInstitution {
  walletAddress: string;
  institutionName: string;
  institutionType: string;
  verifiedAt: number;
  verifiedBy: string;
}

// In-memory storage for MVP (in production, use backend/blockchain)
const verificationRequests: Map<string, InstitutionVerificationRequest> = new Map();
const verifiedInstitutions: Map<string, VerifiedInstitution> = new Map();

// Admin wallet addresses (in production, manage this on-chain via DAO or multi-sig)
// IMPORTANT: Add your wallet address here to become an admin
const ADMIN_ADDRESSES = [
  '0xAdminWallet1234567890123456789012345678901',
  '0xAdminWallet0987654321098765432109876543210',
  '0xb0031491c48bd1a2512f7c3dd086456dba7763ac'
  // Add your wallet addresses below (will be converted to lowercase automatically)
  // Example: '0xYourWalletAddress...',
];

// Convert all admin addresses to lowercase for case-insensitive comparison
const NORMALIZED_ADMIN_ADDRESSES = ADMIN_ADDRESSES.map(addr => addr.toLowerCase());

// Helper Functions

export const isAdmin = (address: string): boolean => {
  return NORMALIZED_ADMIN_ADDRESSES.includes(address.toLowerCase());
};

export const isVerifiedInstitution = (address: string): boolean => {
  return verifiedInstitutions.has(address.toLowerCase());
};

export const getVerificationRequest = (address: string): InstitutionVerificationRequest | undefined => {
  return verificationRequests.get(address.toLowerCase());
};

export const getAllVerificationRequests = (): InstitutionVerificationRequest[] => {
  return Array.from(verificationRequests.values());
};

export const getPendingVerificationRequests = (): InstitutionVerificationRequest[] => {
  return Array.from(verificationRequests.values()).filter(req => req.status === 'pending');
};

export const submitVerificationRequest = (request: Omit<InstitutionVerificationRequest, 'id' | 'submittedAt' | 'status'>): string => {
  const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newRequest: InstitutionVerificationRequest = {
    ...request,
    id,
    submittedAt: Date.now(),
    status: 'pending',
  };
  
  verificationRequests.set(request.walletAddress.toLowerCase(), newRequest);
  return id;
};

export const approveVerificationRequest = (address: string, adminAddress: string): boolean => {
  const request = verificationRequests.get(address.toLowerCase());
  if (!request || request.status !== 'pending') {
    return false;
  }

  request.status = 'approved';
  request.reviewedAt = Date.now();
  request.reviewedBy = adminAddress;

  // Add to verified institutions
  const verifiedInstitution: VerifiedInstitution = {
    walletAddress: address,
    institutionName: request.institutionName,
    institutionType: request.institutionType,
    verifiedAt: Date.now(),
    verifiedBy: adminAddress,
  };

  verifiedInstitutions.set(address.toLowerCase(), verifiedInstitution);
  return true;
};

export const rejectVerificationRequest = (
  address: string, 
  adminAddress: string, 
  reason: string
): boolean => {
  const request = verificationRequests.get(address.toLowerCase());
  if (!request || request.status !== 'pending') {
    return false;
  }

  request.status = 'rejected';
  request.reviewedAt = Date.now();
  request.reviewedBy = adminAddress;
  request.rejectionReason = reason;

  return true;
};

export const getVerifiedInstitution = (address: string): VerifiedInstitution | undefined => {
  return verifiedInstitutions.get(address.toLowerCase());
};

export const getAllVerifiedInstitutions = (): VerifiedInstitution[] => {
  return Array.from(verifiedInstitutions.values());
};

// Mock data for demo purposes
export const initializeMockData = () => {
  // Add a mock verified institution for testing
  const mockVerifiedInstitution: VerifiedInstitution = {
    walletAddress: '0x1234567890123456789012345678901234567890',
    institutionName: 'Demo University',
    institutionType: 'university',
    verifiedAt: Date.now() - 86400000, // 1 day ago
    verifiedBy: ADMIN_ADDRESSES[0],
  };
  
  verifiedInstitutions.set(mockVerifiedInstitution.walletAddress.toLowerCase(), mockVerifiedInstitution);
};

// Initialize mock data
if (typeof window !== 'undefined') {
  initializeMockData();
}
