import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '猫生体管理アプリ',
  description: '猫の生体情報を管理するためのアプリケーションです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <body>
        <div style={{ minHeight: '100vh', padding: '20px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
