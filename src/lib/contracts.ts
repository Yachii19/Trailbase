// Smart Contract Configuration and ABIs for SkillSync Pro

// Base Blockchain Configuration
export const BASE_CHAIN_ID = 84532; // Using Base Sepolia for testing (8453 for mainnet)
export const BASE_SEPOLIA_CHAIN_ID = 84532; // Base Sepolia Testnet

// Contract Addresses (Update after deployment)
// TODO: Deploy contracts and update these addresses
export const CERTIFICATE_CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

export const GIG_ESCROW_CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_GIG_ESCROW_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

// USDC Address - Use testnet USDC or deploy mock ERC20 for testing
export const USDC_CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
    '0x036CbD53842c5426634e7929541eC2318f3dCF7e') as `0x${string}`; // Base Sepolia USDC (testnet)

// Backend API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ERC20 ABI (USDC Token)
export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
] as const;

// VeriScribe Certificate Contract ABI
export const CERTIFICATE_ABI = [
  'function addVerifiedInstitution(address institution) external',
  'function revokeInstitution(address institution) external',
  'function mintCertificate(address student, string institutionName, string courseName, string certificateType, string metadataURI) external returns (uint256)',
  'function revokeCertificate(uint256 tokenId) external',
  'function getCertificate(uint256 tokenId) external view returns (tuple(address student, address institution, string institutionName, string courseName, string certificateType, uint256 issuedDate, bool isValid))',
  'function verifiedInstitutions(address) external view returns (bool)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'function balanceOf(address owner) external view returns (uint256)',
  'event InstitutionVerified(address indexed institution)',
  'event CertificateIssued(uint256 indexed tokenId, address indexed student, address indexed institution, string courseName)',
  'event CertificateRevoked(uint256 indexed tokenId)'
] as const;

// SkillSync Gig Escrow Contract ABI
export const GIG_ESCROW_ABI = [
  'function postGig(string title, string description, uint256 amount, uint256 deadline) external returns (uint256)',
  'function acceptGig(uint256 gigId) external',
  'function releasePayment(uint256 gigId, string metadataURI) external',
  'function cancelGig(uint256 gigId) external',
  'function getGig(uint256 gigId) external view returns (tuple(uint256 gigId, address client, address freelancer, string title, string description, uint256 amount, uint256 deadline, uint8 status, uint256 createdAt, uint256 completedAt))',
  'function getClientGigs(address client) external view returns (uint256[])',
  'function getFreelancerGigs(address freelancer) external view returns (uint256[])',
  'function platformFeePercent() external view returns (uint256)',
  'function gigToProofToken(uint256 gigId) external view returns (uint256)',
  'event GigPosted(uint256 indexed gigId, address indexed client, string title, uint256 amount, uint256 deadline)',
  'event GigAccepted(uint256 indexed gigId, address indexed freelancer)',
  'event GigCompleted(uint256 indexed gigId, address indexed freelancer, uint256 proofTokenId)',
  'event ProofOfWorkMinted(uint256 indexed proofId, address indexed freelancer, uint256 indexed gigId)'
] as const;

// USDC ERC-20 ABI (minimal)
export const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function decimals() external view returns (uint8)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
] as const;

// TypeScript Types
export interface CertificateMetadata {
  institutionName: string;
  courseName: string;
  studentName: string;
  dateIssued: string;
  description: string;
  certificateType: 'course' | 'degree' | 'workshop' | 'certification' | 'bootcamp' | 'skill';
  skills?: string[];
}

export interface CertificateData {
  student: string;
  institution: string;
  institutionName: string;
  courseName: string;
  certificateType: string;
  issuedDate: bigint;
  isValid: boolean;
}

export interface GigData {
  gigId: bigint;
  client: string;
  freelancer: string;
  title: string;
  description: string;
  amount: bigint;
  deadline: bigint;
  status: number; // 0=Open, 1=Accepted, 2=Completed, 3=Disputed, 4=Cancelled
  createdAt: bigint;
  completedAt: bigint;
}

export interface GigFormData {
  title: string;
  description: string;
  category: string;
  skills: string[];
  amount: string;
  deadline: string;
}

export interface GigMetadata {
  title: string;
  description: string;
  skills: string[];
  deliverables: string[];
  category?: string;
}

// Utility functions
export function formatUSDC(amount: bigint): string {
  return (Number(amount) / 1e6).toFixed(2);
}

export function parseUSDC(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1e6));
}

export function getGigStatusLabel(status: number): string {
  const labels = ['Open', 'Accepted', 'Completed', 'Disputed', 'Cancelled'];
  return labels[status] || 'Unknown';
}

export function getGigStatusColor(status: number): string {
  const colors = ['blue', 'yellow', 'green', 'red', 'gray'];
  return colors[status] || 'gray';
}
