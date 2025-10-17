'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Clock, CheckCircle2, XCircle, ExternalLink, Building2, Users } from 'lucide-react';
import { 
  isAdmin, 
  getPendingVerificationRequests, 
  getAllVerificationRequests,
  getAllVerifiedInstitutions,
  approveVerificationRequest, 
  rejectVerificationRequest 
} from '@/lib/verification';
import type { InstitutionVerificationRequest, VerifiedInstitution } from '@/lib/verification';

export default function AdminPanel() {
  const { address, isConnected } = useAccount();
  const [pendingRequests, setPendingRequests] = useState<InstitutionVerificationRequest[]>([]);
  const [allRequests, setAllRequests] = useState<InstitutionVerificationRequest[]>([]);
  const [verifiedInstitutions, setVerifiedInstitutions] = useState<VerifiedInstitution[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<InstitutionVerificationRequest | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    status: string;
    mongodb: string;
    timestamp?: string;
  } | null>(null);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  const loadData = () => {
    setPendingRequests(getPendingVerificationRequests());
    setAllRequests(getAllVerificationRequests());
    setVerifiedInstitutions(getAllVerifiedInstitutions());
  };

  const checkBackendHealth = async () => {
    setIsCheckingBackend(true);
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      setBackendStatus(data);
    } catch (error) {
      setBackendStatus({ status: 'error', mongodb: 'disconnected' });
    } finally {
      setIsCheckingBackend(false);
    }
  };

  useEffect(() => {
    loadData();
    checkBackendHealth();
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to access the admin panel.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin(address!)) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Access Denied. This panel is only accessible to admin wallets.
        </AlertDescription>
      </Alert>
    );
  }

  const getBackendStatusColor = () => {
    if (!backendStatus) return 'gray';
    if (backendStatus.status === 'ok' && backendStatus.mongodb === 'connected') return 'green';
    if (backendStatus.status === 'ok' && backendStatus.mongodb === 'disconnected') return 'orange';
    return 'red';
  };

  const handleApprove = (request: InstitutionVerificationRequest) => {
    const success = approveVerificationRequest(request.walletAddress, address!);
    if (success) {
      loadData();
      alert(`Successfully approved ${request.institutionName}!`);
    } else {
      alert('Failed to approve request.');
    }
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    const success = rejectVerificationRequest(
      selectedRequest.walletAddress, 
      address!, 
      rejectionReason
    );

    if (success) {
      loadData();
      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedRequest(null);
      alert(`Rejected ${selectedRequest.institutionName}'s verification request.`);
    } else {
      alert('Failed to reject request.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
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

  const RequestCard = ({ request }: { request: InstitutionVerificationRequest }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{request.institutionName}</CardTitle>
              <CardDescription className="capitalize">{request.institutionType}</CardDescription>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Registration #</p>
            <p className="text-gray-900">{request.registrationNumber}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Contact Email</p>
            <p className="text-gray-900 truncate">{request.contactEmail}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold text-gray-700">Website</p>
            <a 
              href={request.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center space-x-1"
            >
              <span className="truncate">{request.website}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
          <div className="col-span-2">
            <p className="font-semibold text-gray-700">Official Document</p>
            <a 
              href={request.officialDocumentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center space-x-1"
            >
              <span className="truncate">View Document</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
          <div className="col-span-2">
            <p className="font-semibold text-gray-700">Wallet Address</p>
            <p className="font-mono text-xs text-gray-900 truncate">{request.walletAddress}</p>
          </div>
          {request.description && (
            <div className="col-span-2">
              <p className="font-semibold text-gray-700">Description</p>
              <p className="text-gray-900 text-sm">{request.description}</p>
            </div>
          )}
          <div className="col-span-2">
            <p className="font-semibold text-gray-700">Submitted</p>
            <p className="text-gray-900">{new Date(request.submittedAt).toLocaleString()}</p>
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => handleApprove(request)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setSelectedRequest(request)}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Verification Request</DialogTitle>
                  <DialogDescription>
                    Provide a reason for rejecting {request.institutionName}'s verification request.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Please explain why this request is being rejected..."
                      value={rejectionReason}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        setRejectionReason(e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex-1"
                    >
                      Confirm Rejection
                    </Button>
                    <Button
                      onClick={() => {
                        setIsRejectDialogOpen(false);
                        setRejectionReason('');
                        setSelectedRequest(null);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {request.status === 'rejected' && request.rejectionReason && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Rejection Reason:</strong> {request.rejectionReason}
            </AlertDescription>
          </Alert>
        )}

        {request.status === 'approved' && request.reviewedAt && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              Approved on {new Date(request.reviewedAt).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-3xl">Admin Panel</CardTitle>
                <CardDescription className="text-purple-100">
                  Manage institution verification requests
                </CardDescription>
              </div>
            </div>
            {/* Backend Status Indicator */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={checkBackendHealth}
                disabled={isCheckingBackend}
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                {isCheckingBackend ? 'Checking...' : 'Check Backend'}
              </Button>
              {backendStatus && (
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      getBackendStatusColor() === 'green' ? 'bg-green-400' :
                      getBackendStatusColor() === 'orange' ? 'bg-orange-400' :
                      getBackendStatusColor() === 'red' ? 'bg-red-400' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-xs text-white/90">
                    Backend: {backendStatus.status === 'ok' ? 'Online' : 'Offline'}
                  </span>
                  <span className="text-xs text-white/90">|</span>
                  <span className="text-xs text-white/90">
                    MongoDB: {backendStatus.mongodb === 'connected' ? '✅' : '❌'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Backend Status Alert */}
      {backendStatus && backendStatus.mongodb !== 'connected' && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>⚠️ MongoDB Not Connected!</strong> Backend is {backendStatus.status === 'ok' ? 'running' : 'offline'}, but MongoDB is disconnected. 
            Data operations may fail. Check your MongoDB connection in backend/.env
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verifiedInstitutions.length}</p>
                <p className="text-sm text-gray-600">Verified Institutions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allRequests.length}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Requests ({allRequests.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({verifiedInstitutions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No pending verification requests
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request: InstitutionVerificationRequest) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {allRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No verification requests yet
              </CardContent>
            </Card>
          ) : (
            allRequests.map((request: InstitutionVerificationRequest) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="verified" className="space-y-4 mt-6">
          {verifiedInstitutions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No verified institutions yet
              </CardContent>
            </Card>
          ) : (
            verifiedInstitutions.map((institution: VerifiedInstitution) => (
              <Card key={institution.walletAddress}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{institution.institutionName}</CardTitle>
                      <CardDescription className="capitalize">{institution.institutionType}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Wallet Address</p>
                    <p className="font-mono text-xs text-gray-900 truncate">
                      {institution.walletAddress}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">Verified On</p>
                    <p className="text-gray-900">
                      {new Date(institution.verifiedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
