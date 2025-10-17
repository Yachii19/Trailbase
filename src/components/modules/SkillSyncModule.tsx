'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, DollarSign, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { GIG_ESCROW_CONTRACT_ADDRESS, GIG_ESCROW_ABI, BASE_CHAIN_ID, USDC_CONTRACT_ADDRESS, ERC20_ABI } from '@/lib/contracts';
import type { GigMetadata } from '@/lib/contracts';

interface GigFormData extends GigMetadata {
  amount: string;
  deadline: string;
}

export default function SkillSyncModule() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('create');
  const [gigFormData, setGigFormData] = useState<GigFormData>({
    title: '',
    description: '',
    skills: [],
    deliverables: [],
    amount: '',
    deadline: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [deliverableInput, setDeliverableInput] = useState('');
  
  // Check if contracts are deployed
  const contractsDeployed = GIG_ESCROW_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  const handleInputChange = (field: string, value: string) => {
    setGigFormData((prev: GigFormData) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setGigFormData((prev: GigFormData) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setGigFormData((prev: GigFormData) => ({
      ...prev,
      skills: prev.skills.filter((_: string, i: number) => i !== index),
    }));
  };

  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      setGigFormData((prev: GigFormData) => ({
        ...prev,
        deliverables: [...prev.deliverables, deliverableInput.trim()],
      }));
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (index: number) => {
    setGigFormData((prev: GigFormData) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_: string, i: number) => i !== index),
    }));
  };

  // Convert deadline to Unix timestamp
  const getDeadlineTimestamp = () => {
    if (!gigFormData.deadline) return BigInt(0);
    return BigInt(Math.floor(new Date(gigFormData.deadline).getTime() / 1000));
  };

  // Convert USDC amount (6 decimals)
  const getUSDCAmount = () => {
    if (!gigFormData.amount) return BigInt(0);
    return BigInt(Math.floor(parseFloat(gigFormData.amount) * 1000000));
  };

  const createGigCalls = gigFormData.title && gigFormData.amount && gigFormData.deadline
    ? [
        // First approve USDC spending
        {
          address: USDC_CONTRACT_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [GIG_ESCROW_CONTRACT_ADDRESS, getUSDCAmount()],
        },
        // Then create the gig
        {
          address: GIG_ESCROW_CONTRACT_ADDRESS,
          abi: GIG_ESCROW_ABI,
          functionName: 'createGig',
          args: [
            gigFormData.title,
            gigFormData.description,
            getUSDCAmount(),
            getDeadlineTimestamp(),
          ],
        },
      ]
    : [];

  // Mock data for demonstration
  const mockGigs = [
    {
      id: 1,
      title: 'Build Smart Contract for NFT Marketplace',
      description: 'Need a Solidity developer to create an NFT marketplace contract',
      amount: '500',
      deadline: '2025-02-15',
      status: 'Open',
      client: '0x1234...5678',
      skills: ['Solidity', 'Smart Contracts', 'Web3'],
    },
    {
      id: 2,
      title: 'Frontend Development for DeFi Dashboard',
      description: 'Build a responsive dashboard for DeFi protocol',
      amount: '750',
      deadline: '2025-02-20',
      status: 'Accepted',
      client: '0x8765...4321',
      freelancer: address,
      skills: ['React', 'TypeScript', 'Web3.js'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Briefcase className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-3xl">SkillSync Dashboard</CardTitle>
              <CardDescription className="text-purple-100">
                Freelance Gigs with USDC Escrow & Proof-of-Work NFTs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contract Deployment Warning */}
      {!contractsDeployed && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>⚠️ Smart Contracts Not Deployed!</strong>
            <br />The SkillSync escrow contract hasn't been deployed to Base yet.
            <br />📖 To deploy: See <code className="bg-red-100 px-1 rounded">DEPLOYMENT_GUIDE.md</code>
            <br />For now, you can browse the UI but transactions will fail.
          </AlertDescription>
        </Alert>
      )}

      {!isConnected && (
        <Alert>
          <AlertDescription>
            Please connect your wallet to post gigs or accept work.
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Post Gig</TabsTrigger>
            <TabsTrigger value="browse">Browse Gigs</TabsTrigger>
            <TabsTrigger value="my-gigs">My Gigs</TabsTrigger>
          </TabsList>

          {/* Create Gig Tab */}
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post New Gig</CardTitle>
                  <CardDescription>
                    Create a gig with USDC escrow payment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gigTitle">Gig Title</Label>
                    <Input
                      id="gigTitle"
                      placeholder="e.g., Build a DeFi Dashboard"
                      value={gigFormData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('title', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gigDescription">Description</Label>
                    <Textarea
                      id="gigDescription"
                      placeholder="Detailed description of the work required..."
                      value={gigFormData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleInputChange('description', e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gigAmount" className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>Payment Amount (USDC)</span>
                    </Label>
                    <Input
                      id="gigAmount"
                      type="number"
                      placeholder="e.g., 500"
                      value={gigFormData.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('amount', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gigDeadline" className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Deadline</span>
                    </Label>
                    <Input
                      id="gigDeadline"
                      type="date"
                      value={gigFormData.deadline}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('deadline', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a skill (e.g., React)"
                        value={skillInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setSkillInput(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button onClick={addSkill} type="button">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {gigFormData.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                          <button
                            onClick={() => removeSkill(index)}
                            className="ml-2 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Deliverables</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a deliverable"
                        value={deliverableInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setDeliverableInput(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addDeliverable();
                          }
                        }}
                      />
                      <Button onClick={addDeliverable} type="button">Add</Button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {gigFormData.deliverables.map((deliverable: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{deliverable}</span>
                          <button
                            onClick={() => removeDeliverable(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {createGigCalls.length > 0 ? (
                    <div className="space-y-3">
                      <Alert>
                        <AlertDescription>
                          <strong>📝 Transaction Preview:</strong>
                          <br />• Approve: {gigFormData.amount} USDC
                          <br />• Create Gig: "{gigFormData.title}"
                          <br />• Deadline: {new Date(gigFormData.deadline).toLocaleDateString()}
                        </AlertDescription>
                      </Alert>
                      <Transaction
                        chainId={BASE_CHAIN_ID}
                        calls={createGigCalls}
                        onError={(error) => {
                          console.error('Transaction error:', error);
                          alert(`Transaction failed: ${error.message || 'Unknown error'}`);
                        }}
                        onSuccess={(response) => {
                          console.log('Transaction success:', response);
                          alert('✅ Gig created successfully!');
                          // Reset form
                          setGigFormData({
                            title: '',
                            description: '',
                            skills: [],
                            deliverables: [],
                            amount: '',
                            deadline: '',
                          });
                        }}
                      >
                        <TransactionButton className="w-full bg-purple-600 hover:bg-purple-700 text-white" />
                        <TransactionStatus>
                          <TransactionStatusLabel />
                        </TransactionStatus>
                      </Transaction>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        ⚠️ Please fill in Title, Amount, and Deadline to create a gig.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-900">How SkillSync Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">Post Gig with Escrow</p>
                        <p className="text-sm text-purple-700">
                          Client posts gig and deposits USDC into smart contract escrow
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">Freelancer Accepts</p>
                        <p className="text-sm text-purple-700">
                          Freelancer reviews and accepts the gig to start work
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">Complete & Release</p>
                        <p className="text-sm text-purple-700">
                          Client releases payment after work completion
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">Automatic NFT Mint</p>
                        <p className="text-sm text-purple-700">
                          Proof-of-Work NFT is automatically minted to freelancer
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg space-y-2 mt-4">
                    <p className="font-semibold text-purple-900">Security Features:</p>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>✓ USDC locked in smart contract escrow</li>
                      <li>✓ Trustless payment release</li>
                      <li>✓ Automatic NFT proof of work</li>
                      <li>✓ Dispute resolution (future)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Browse Gigs Tab */}
          <TabsContent value="browse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockGigs
                .filter((gig: { status: string }) => gig.status === 'Open')
                .map((gig: { id: number; title: string; description: string; amount: string; deadline: string; status: string; client: string; skills: string[] }) => (
                  <Card key={gig.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{gig.title}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          {gig.status}
                        </Badge>
                      </div>
                      <CardDescription>{gig.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">${gig.amount}</span>
                          <span className="text-gray-600">USDC</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{gig.deadline}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {gig.skills.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>Client: {gig.client}</p>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Accept Gig
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* My Gigs Tab */}
          <TabsContent value="my-gigs">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGigs.map((gig: { id: number; title: string; description: string; amount: string; deadline: string; status: string; client: string; freelancer?: string; skills: string[] }) => (
                  <Card key={gig.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{gig.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            gig.status === 'Open'
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : 'bg-blue-50 text-blue-700 border-blue-300'
                          }
                        >
                          {gig.status}
                        </Badge>
                      </div>
                      <CardDescription>{gig.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-xl font-bold text-green-600">${gig.amount}</span>
                          <span className="text-gray-600 text-sm">USDC</span>
                        </div>
                      </div>

                      {gig.status === 'Accepted' && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Release Payment & Mint NFT
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
