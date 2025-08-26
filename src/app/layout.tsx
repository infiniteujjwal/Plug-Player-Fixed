
import React from 'react';
import './globals.css';

export const metadata = {
  title: 'PlugPlayers',
  description: 'Plug-and-play startup talent',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
