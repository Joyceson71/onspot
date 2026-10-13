import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'OnSpot | Instant Part-Time & Gig Staffing Platform',
  description: 'Instant Part-Time & Gig Staffing Platform',
  icons: {
    icon: '/assets/onspot-logo-transparent.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
