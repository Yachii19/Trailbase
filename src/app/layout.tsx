import type { Metadata } from 'next'
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import FarcasterWrapper from "@/components/FarcasterWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body>
            <Providers>
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      </Providers>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "TrailBase MVP",
        description: "TrailBase is a Web3 app for academic and gig verification on Base blockchain, using NFTs for achievements and USDC for escrow. Enhance your career with verifiable records.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_0edf92c1-7e03-4d7e-bf0b-79895a959a74-dKtW7PWOHDT6RhluGC56TUGdpLGnvX","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"TrailBase MVP","url":"https://could-troops-672.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
