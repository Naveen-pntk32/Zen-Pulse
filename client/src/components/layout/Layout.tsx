import React, { useState } from 'react';
import { Sidebar, MobileSidebar, MobileHeader } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader onMenuOpen={() => setMobileOpen(true)} />
        <main className={cn('flex-1 p-4 md:p-8', 'max-w-7xl w-full mx-auto')}>
          {children}
        </main>
      </div>
    </div>
  );
}
