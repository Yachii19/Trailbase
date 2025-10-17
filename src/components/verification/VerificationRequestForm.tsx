'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, Mail, Globe, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { submitVerificationRequest, getVerificationRequest, isVerifiedInstitution } from '@/lib/verification';
import type { InstitutionVerificationRequest } from '@/lib/verification';

export default function VerificationRequestForm() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'university' as const,
    registrationNumber: '',
    website: '',
    contactEmail: '',
    officialDocumentUrl: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [existingRequest, setExistingRequest] = useState<InstitutionVerificationRequest | null>(null);

  // Check for existing request on mount
  useState(() => {
    if (address) {
      const request = getVerificationRequest(address);
      if (request) {
        setExistingRequest(request);
        setSubmitted(true);
      }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    // Check if already verified
    if (isVerifiedInstitution(address)) {
      alert('Your institution is already verified!');
      return;
    }

    // Check for existing request
    const existing = getVerificationRequest(address);
    if (existing && existing.status === 'pending') {
      alert('You already have a pending verification request.');
      setExistingRequest(existing);
      setSubmitted(true);
      return;
    }

    const requestId = submitVerificationRequest({
      walletAddress: address,
      ...formData,
    });

    setSubmitted(true);
    const newRequest = getVerificationRequest(address);
    if (newRequest) {
      setExistingRequest(newRequest);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your institutional wallet to request verification.
        </AlertDescription>
      </Alert>
    );
  }

  if (isVerifiedInstitution(address!)) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-green-900">Institution Verified!</CardTitle>
              <CardDescription className="text-green-700">
                Your institution is verified and can issue certificates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600">
              Verified Wallet: <span className="font-mono text-xs">{address}</span>
            </p>
            <p className="text-sm text-green-700 mt-2">
              ✓ You can now issue NFT certificates to students
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submitted && existingRequest) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verification Request Status</CardTitle>
              <CardDescription>Request ID: {existingRequest.id}</CardDescription>
            </div>
            {getStatusBadge(existingRequest.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Institution Name</p>
              <p className="text-sm text-gray-900">{existingRequest.institutionName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Type</p>
              <p className="text-sm text-gray-900 capitalize">{existingRequest.institutionType}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Website</p>
              <p className="text-sm text-blue-600">{existingRequest.website}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Contact Email</p>
              <p className="text-sm text-gray-900">{existingRequest.contactEmail}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-700">Submitted</p>
              <p className="text-sm text-gray-900">
                {new Date(existingRequest.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {existingRequest.status === 'rejected' && existingRequest.rejectionReason && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Rejection Reason:</strong> {existingRequest.rejectionReason}
              </AlertDescription>
            </Alert>
          )}

          {existingRequest.status === 'pending' && (
            <Alert>
              <AlertDescription>
                Your verification request is being reviewed by our admin team. You'll be able to issue certificates once approved.
              </AlertDescription>
            </Alert>
          )}

          {existingRequest.status === 'rejected' && (
            <Button
              onClick={() => {
                setSubmitted(false);
                setExistingRequest(null);
              }}
              variant="outline"
              className="w-full"
            >
              Submit New Request
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <span>Institution Verification Request</span>
        </CardTitle>
        <CardDescription>
          Submit your institution credentials for verification before issuing certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span>Institution Name *</span>
            </Label>
            <Input
              id="institutionName"
              placeholder="e.g., Stanford University"
              value={formData.institutionName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('institutionName', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutionType">Institution Type *</Label>
            <Select
              value={formData.institutionType}
              onValueChange={(value: string) => handleInputChange('institutionType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="training-center">Training Center</SelectItem>
                <SelectItem value="bootcamp">Bootcamp</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber" className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>Official Registration Number *</span>
            </Label>
            <Input
              id="registrationNumber"
              placeholder="e.g., REG-2024-12345"
              value={formData.registrationNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('registrationNumber', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span>Official Website *</span>
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.yourinstitution.edu"
              value={formData.website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('website', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>Official Contact Email *</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="admin@yourinstitution.edu"
              value={formData.contactEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('contactEmail', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="officialDocumentUrl" className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>Link to Official Document/Proof *</span>
            </Label>
            <Input
              id="officialDocumentUrl"
              type="url"
              placeholder="https://drive.google.com/..."
              value={formData.officialDocumentUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('officialDocumentUrl', e.target.value)
              }
              required
            />
            <p className="text-xs text-gray-500">
              Upload proof document (accreditation, registration certificate) to Google Drive or similar and share the link
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Information</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your institution and why you need to issue certificates..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                handleInputChange('description', e.target.value)
              }
              rows={4}
            />
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Note:</strong> Your request will be reviewed by our admin team. Only verified institutions can issue certificates to prevent fraud.
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Submit Verification Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
