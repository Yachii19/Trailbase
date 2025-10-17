'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Building2, User, Calendar, FileText, ShieldAlert, ShieldCheck, FileCheck } from 'lucide-react';
import { CERTIFICATE_CONTRACT_ADDRESS, CERTIFICATE_ABI, BASE_CHAIN_ID } from '@/lib/contracts';
import type { CertificateMetadata } from '@/lib/contracts';
import { isVerifiedInstitution, isAdmin } from '@/lib/verification';
import VerificationRequestForm from '@/components/verification/VerificationRequestForm';
import AdminPanel from '@/components/verification/AdminPanel';

const ADMIN_ADDRESSES = [
  '0xAdminWallet1234567890123456789012345678901',
  '0xAdminWallet0987654321098765432109876543210',
  '0xb0031491c48bd1a2512f7c3dd086456dba7763ac', // <-- Paste here
];

export default function VeriScribeModule() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState<CertificateMetadata & { studentAddress: string }>({
    institutionName: '',
    courseName: '',
    studentName: '',
    studentAddress: '',
    dateIssued: new Date().toISOString().split('T')[0],
    description: '',
    certificateType: 'course',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
  };

  // Create metadata URI (in production, this would be uploaded to IPFS)
  const createMetadataURI = () => {
    const metadata = {
      name: `${formData.courseName} Certificate`,
      description: formData.description,
      image: 'ipfs://certificate-image-hash',
      attributes: [
        { trait_type: 'Institution', value: formData.institutionName },
        { trait_type: 'Course', value: formData.courseName },
        { trait_type: 'Student', value: formData.studentName },
        { trait_type: 'Date Issued', value: formData.dateIssued },
        { trait_type: 'Type', value: formData.certificateType },
      ],
    };
    // In production: upload to IPFS and return the hash
    // Using crypto.randomUUID() for consistent server/client generation
    const randomId = typeof window !== 'undefined' && window.crypto 
      ? window.crypto.randomUUID() 
      : Math.random().toString(36).substring(7);
    return `ipfs://mock-hash-${randomId}`;
  };

  const calls = formData.studentAddress
    ? [
        {
          address: CERTIFICATE_CONTRACT_ADDRESS,
          abi: CERTIFICATE_ABI,
          functionName: 'mintCertificate',
          args: [formData.studentAddress as `0x${string}`, createMetadataURI()],
        },
      ]
    : [];

  const userIsAdmin = address ? isAdmin(address) : false;
  const userIsVerified = address ? isVerifiedInstitution(address) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-3xl">VeriScribe Dashboard</CardTitle>
                <CardDescription className="text-blue-100">
                  Issue NFT Certificates for Academic Achievements
                </CardDescription>
              </div>
            </div>
            {/* Admin & Verification Status Badges */}
            <div className="flex flex-col gap-2">
              {userIsAdmin && (
                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Admin Access
                </Badge>
              )}
              {userIsVerified && (
                <Badge className="bg-green-400 text-green-900 hover:bg-green-300">
                  <Building2 className="h-3 w-3 mr-1" />
                  Verified Institution
                </Badge>
              )}
              {!userIsVerified && !userIsAdmin && (
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  <User className="h-3 w-3 mr-1" />
                  Guest Access
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isConnected ? (
        <Alert>
          <AlertDescription>
            Please connect your wallet to access VeriScribe features.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue={userIsAdmin ? 'admin' : userIsVerified ? 'issue' : 'verify'} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${userIsAdmin ? 3 : 2}, 1fr)` }}>
            {userIsVerified && (
              <TabsTrigger value="issue" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Issue Certificates</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="verify" className="flex items-center space-x-2">
              <FileCheck className="h-4 w-4" />
              <span>Request Verification</span>
            </TabsTrigger>
            {userIsAdmin && (
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Panel</span>
              </TabsTrigger>
            )}
          </TabsList>

          {userIsVerified && (
            <TabsContent value="issue" className="mt-6">
              {!isVerifiedInstitution(address!) ? (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Verification Required:</strong> Your institution must be verified before issuing certificates.
                  </AlertDescription>
                </Alert>
              ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issue Certificate Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Issue New Certificate</span>
              </CardTitle>
              <CardDescription>
                Create a non-transferable soulbound certificate NFT (Your institution is verified ✓)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>Institution Name</span>
                </Label>
                <Input
                  id="institutionName"
                  placeholder="e.g., Stanford University"
                  value={formData.institutionName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('institutionName', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseName" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>Course/Degree Name</span>
                </Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Computer Science Degree"
                  value={formData.courseName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('courseName', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select
                  value={formData.certificateType}
                  onValueChange={(value: string) => handleInputChange('certificateType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="degree">Degree</SelectItem>
                    <SelectItem value="course">Course Completion</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="training">Training Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Student Name</span>
                </Label>
                <Input
                  id="studentName"
                  placeholder="e.g., John Doe"
                  value={formData.studentName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('studentName', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentAddress" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Student Wallet Address</span>
                </Label>
                <Input
                  id="studentAddress"
                  placeholder="0x..."
                  value={formData.studentAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('studentAddress', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateIssued" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Date of Issuance</span>
                </Label>
                <Input
                  id="dateIssued"
                  type="date"
                  value={formData.dateIssued}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('dateIssued', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the certificate..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleInputChange('description', e.target.value)
                  }
                  rows={3}
                />
              </div>

              {formData.studentAddress && calls.length > 0 && (
                <Transaction
                  chainId={BASE_CHAIN_ID}
                  calls={calls}
                >
                  <TransactionButton className="w-full bg-blue-600 hover:bg-blue-700 text-white" />
                  <TransactionStatus>
                    <TransactionStatusLabel />
                  </TransactionStatus>
                </Transaction>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">How VeriScribe Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Connect Institution Wallet</p>
                      <p className="text-sm text-blue-700">
                        Authorized institutions connect their wallet to issue certificates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Fill Certificate Details</p>
                      <p className="text-sm text-blue-700">
                        Enter student info, course details, and issuance date
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Mint Soulbound NFT</p>
                      <p className="text-sm text-blue-700">
                        Certificate is minted as a non-transferable NFT to student's wallet
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Verify on Blockchain</p>
                      <p className="text-sm text-blue-700">
                        Anyone can verify the certificate's authenticity on Base
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Non-Transferable</p>
                    <p className="text-xs text-gray-600">Soulbound tokens prevent fraud</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Immutable Record</p>
                    <p className="text-xs text-gray-600">Permanent verification on Base</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Public Verification</p>
                    <p className="text-xs text-gray-600">Anyone can verify authenticity</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ERC-721 Standard</p>
                    <p className="text-xs text-gray-600">Compatible with all wallets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="verify" className="mt-6">
            <VerificationRequestForm />
          </TabsContent>

          {userIsAdmin && (
            <TabsContent value="admin" className="mt-6">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
