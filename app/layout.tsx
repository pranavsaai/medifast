// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Navbar from '@/components/ui/Navbar';
import BgOrbs from '@/components/ui/BgOrbs';

export const metadata: Metadata = {
  title: 'MediAssist — AI Emergency First Aid',
  description: 'AI-guided emergency first aid with NLP, ML severity analysis, and trusted medical knowledge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <BgOrbs />
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}