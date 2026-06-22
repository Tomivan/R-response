import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import { FirebaseProvider } from '../../firebase/firebaseProvider';
import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';
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
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={3000}
              expand={false}
              visibleToasts={5}
              toastOptions={{
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                },
                className: 'sonner-toast',
              }}
            />
            {children}
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}