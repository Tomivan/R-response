import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import { FirebaseProvider } from '../../firebase/firebaseProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'R-Response - Incident Management System',
  description: 'Redemption City Incident Management System Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}