import React from 'react';

export const metadata = {
  title: 'Rango Widget on Next.js',
  description: 'Rango exchange.',
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
