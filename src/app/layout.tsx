import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { GaushalaProvider } from '@/context/GaushalaContext';

export const metadata: Metadata = {
  title: 'Gaushala Cattle Management System | ગૌશાળા વ્યવસ્થાપન',
  description: 'Production cattle management system with Gujarati & English support, family tree, pregnancy tracking, milk production, health records, and QR code field scanning.',
  manifest: '/manifest.json',
  themeColor: '#111827',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="gu" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Vadodara:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 min-h-screen">
        <AuthProvider>
          <LanguageProvider>
            <GaushalaProvider>
              {children}
            </GaushalaProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
