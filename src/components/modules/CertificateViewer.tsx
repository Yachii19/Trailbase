'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Briefcase, Calendar, Building2, User, ExternalLink, Share2 } from 'lucide-react';

interface Certificate {
  id: number;
  type: 'academic' | 'work';
  title: string;
  issuer: string;
  date: string;
  description: string;
  tokenId: string;
  metadata: Record<string, string>;
}

export default function CertificateViewer() {
  const { address, isConnected } = useAccount();
  const [searchAddress, setSearchAddress] = useState('');
  const [viewMode, setViewMode] = useState<'my-certificates' | 'search'>('my-certificates');

  // Mock certificates for demonstration
  const mockCertificates: Certificate[] = [
    {
      id: 1,
      type: 'academic',
      title: 'Computer Science Degree',
      issuer: 'Stanford University',
      date: '2024-06-15',
      description: 'Bachelor of Science in Computer Science',
      tokenId: '123',
      metadata: {
        'GPA': '3.8',
        'Honors': 'Cum Laude',
        'Specialization': 'Blockchain Technology',
      },
    },
    {
      id: 2,
      type: 'academic',
      title: 'Smart Contract Development',
      issuer: 'MIT OpenCourseWare',
      date: '2024-03-20',
      description: 'Advanced Solidity and Smart Contract Security',
      tokenId: '456',
      metadata: {
        'Duration': '12 Weeks',
        'Grade': 'A',
      },
    },
    {
      id: 3,
      type: 'work',
      title: 'DeFi Dashboard Development',
      issuer: '0x1234...5678',
      date: '2024-08-10',
      description: 'Built a comprehensive DeFi analytics dashboard with real-time data',
      tokenId: '789',
      metadata: {
        'Payment': '750 USDC',
        'Rating': '5/5',
        'Skills': 'React, TypeScript, Web3.js',
      },
    },
    {
      id: 4,
      type: 'work',
      title: 'NFT Marketplace Smart Contract',
      issuer: '0x8765...4321',
      date: '2024-09-05',
      description: 'Developed and audited NFT marketplace contract with royalty features',
      tokenId: '012',
      metadata: {
        'Payment': '1200 USDC',
        'Rating': '5/5',
        'Skills': 'Solidity, OpenZeppelin, Hardhat',
      },
    },
  ];

  const academicCertificates = mockCertificates.filter((cert: Certificate) => cert.type === 'academic');
  const workCertificates = mockCertificates.filter((cert: Certificate) => cert.type === 'work');

  const handleShare = (cert: Certificate) => {
    const shareUrl = `${window.location.origin}/certificate/${cert.tokenId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Certificate link copied to clipboard!');
  };

  const handleVerifyOnChain = (tokenId: string) => {
    window.open(`https://basescan.org/token/${tokenId}`, '_blank');
  };

  const renderCertificateCard = (cert: Certificate) => (
    <Card key={cert.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${cert.type === 'academic' ? 'bg-blue-100' : 'bg-purple-100'}`}>
              {cert.type === 'academic' ? (
                <Award className={`h-6 w-6 ${cert.type === 'academic' ? 'text-blue-600' : 'text-purple-600'}`} />
              ) : (
                <Briefcase className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{cert.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2 mt-1">
                {cert.type === 'academic' ? (
                  <Building2 className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                <span>{cert.issuer}</span>
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={cert.type === 'academic' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-purple-50 text-purple-700 border-purple-300'}>
            {cert.type === 'academic' ? 'Academic' : 'Work Proof'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm">{cert.description}</p>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Issued: {new Date(cert.date).toLocaleDateString()}</span>
        </div>

        <div className="space-y-2">
          {Object.entries(cert.metadata).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600">{key}:</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVerifyOnChain(cert.tokenId)}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Verify On-Chain
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare(cert)}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 font-mono">
          Token ID: {cert.tokenId}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-3xl">Certificate Viewer</CardTitle>
              <CardDescription className="text-green-100">
                View & Verify Your On-Chain Career Record
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isConnected && (
        <Alert>
          <AlertDescription>
            Please connect your wallet to view your certificates and work proofs.
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <div className="space-y-6">
          {/* View Mode Toggle */}
          <div className="flex space-x-4">
            <Button
              variant={viewMode === 'my-certificates' ? 'default' : 'outline'}
              onClick={() => setViewMode('my-certificates')}
            >
              My Certificates
            </Button>
            <Button
              variant={viewMode === 'search' ? 'default' : 'outline'}
              onClick={() => setViewMode('search')}
            >
              Search Address
            </Button>
          </div>

          {/* Search Mode */}
          {viewMode === 'search' && (
            <Card>
              <CardHeader>
                <CardTitle>Search Certificates by Address</CardTitle>
                <CardDescription>
                  Enter a wallet address to view their verifiable credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchAddress">Wallet Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="searchAddress"
                      placeholder="0x..."
                      value={searchAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setSearchAddress(e.target.value)
                      }
                    />
                    <Button>Search</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Certificates Mode */}
          {viewMode === 'my-certificates' && (
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All ({mockCertificates.length})</TabsTrigger>
                <TabsTrigger value="academic">Academic ({academicCertificates.length})</TabsTrigger>
                <TabsTrigger value="work">Work Proofs ({workCertificates.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockCertificates.map((cert: Certificate) => renderCertificateCard(cert))}
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {academicCertificates.map((cert: Certificate) => renderCertificateCard(cert))}
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {workCertificates.map((cert: Certificate) => renderCertificateCard(cert))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Stats Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Your Career Record
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{academicCertificates.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Academic Certificates</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{workCertificates.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Work Proofs</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">
                      {workCertificates.reduce((sum: number, cert: Certificate) => {
                        const payment = cert.metadata['Payment'];
                        if (payment) {
                          const amount = parseInt(payment.replace(/[^\d]/g, ''));
                          return sum + amount;
                        }
                        return sum;
                      }, 0)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">USDC Earned</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
