// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'MediAssist — Emergency First Aid',
  description: 'Step-by-step emergency first aid guide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}