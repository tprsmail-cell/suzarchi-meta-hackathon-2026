import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/lib/localeContext';
import { RoleProvider } from '@/lib/roleContext';

export const metadata: Metadata = {
  title: 'SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities.',
  description: 'AI-assisted circular materials intelligence and opportunity discovery platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F2F5F3] text-[#18241D] antialiased">
        <LocaleProvider>
          <RoleProvider>{children}</RoleProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
