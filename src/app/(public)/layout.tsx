import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VerificationManager from '@/components/shared/VerificationManager'; // <-- Import

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-deep">
      <Navbar />
      
      {/* Suspense is required for useSearchParams in Next.js */}
      <Suspense fallback={null}>
        <VerificationManager />
      </Suspense>

      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
