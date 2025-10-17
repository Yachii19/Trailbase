'use client';

import { useState, useEffect } from 'react';
import { WalletDefault } from '@coinbase/onchainkit/wallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Briefcase, Award, Wallet } from 'lucide-react';
import VeriScribeModule from '@/components/modules/VeriScribeModule';
import SkillSyncModule from '@/components/modules/SkillSyncModule';
import CertificateViewer from '@/components/modules/CertificateViewer';
import { sdk } from "@farcaster/miniapp-sdk";

export default function TrailBaseHome() {
  const [activeModule, setActiveModule] = useState<string>('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve(void 0);
            } else {
              window.addEventListener('load', () => resolve(void 0), { once: true });
            }
          });
        }

        await sdk.actions.ready();
        console.log("Farcaster SDK initialized successfully - app fully loaded");
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log('Farcaster SDK initialized on retry');
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError);
          }
        }, 1000);
      }
    };
    
    initializeFarcaster();
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TrailBase</h1>
                <p className="text-sm text-gray-600">On Base Blockchain</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                Base Network
              </Badge>
              <WalletDefault />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeModule === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Unified Verification & Gig Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Build your verifiable on-chain career record with academic certificates and freelance work verification — all under one wallet identity.
              </p>
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VeriScribe Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-blue-600">VeriScribe</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Academic & Skills Verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Issue and verify NFT-based certificates for degrees, courses, and training programs. Non-transferable soulbound tokens ensure authenticity.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-blue-500" />
                      Issue NFT Certificates
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-blue-500" />
                      Non-transferable (Soulbound)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-blue-500" />
                      Public Verification
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveModule('veriscribe')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Launch VeriScribe
                  </Button>
                </CardContent>
              </Card>

              {/* SkillSync Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Briefcase className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl text-purple-600">SkillSync</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Freelance Gig & Experience Verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Post gigs, escrow payments in USDC, and automatically mint Proof-of-Work NFTs upon completion. Build your verifiable freelance portfolio.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Wallet className="h-4 w-4 mr-2 text-purple-500" />
                      USDC Escrow Payments
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-purple-500" />
                      Proof-of-Work NFTs
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2 text-purple-500" />
                      Smart Contract Escrow
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveModule('skillsync')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Launch SkillSync
                  </Button>
                </CardContent>
              </Card>

              {/* Certificate Viewer Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500 md:col-span-2">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Award className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-green-600">Certificate Viewer</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    View & Verify NFT Certificates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    View all your certificates and work proofs in one place. Share your verifiable career record with employers and institutions.
                  </p>
                  <Button 
                    onClick={() => setActiveModule('certificates')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    View My Certificates
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-md">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Why TrailBase?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-full inline-block mb-4">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Unified Identity</h4>
                    <p className="text-gray-600 text-sm">
                      One wallet address for all your academic and work credentials
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-full inline-block mb-4">
                      <Wallet className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Secure Escrow</h4>
                    <p className="text-gray-600 text-sm">
                      Smart contract-based USDC payments with automatic release
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-full inline-block mb-4">
                      <Briefcase className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Immutable Record</h4>
                    <p className="text-gray-600 text-sm">
                      Build your verifiable career history on the Base blockchain
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeModule === 'veriscribe' && (
          <div>
            <Button 
              onClick={() => setActiveModule('home')}
              variant="outline"
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <VeriScribeModule />
          </div>
        )}

        {activeModule === 'skillsync' && (
          <div>
            <Button 
              onClick={() => setActiveModule('home')}
              variant="outline"
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <SkillSyncModule />
          </div>
        )}

        {activeModule === 'certificates' && (
          <div>
            <Button 
              onClick={() => setActiveModule('home')}
              variant="outline"
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <CertificateViewer />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built on Base • Powered by OnchainKit • Created with Modu on Ohara
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
