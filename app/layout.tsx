import './globals.css';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

export const metadata = {
  title: 'JobeasyO - AI Career Assistant',
  description: 'Your AI-powered career assistant to help you find your perfect role',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/UVMark-White.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-black text-white min-h-screen overflow-x-hidden antialiased selection:bg-blue-500/30 selection:text-white">
        <ErrorBoundary>
          <ToastProvider>
            <main className="relative min-h-screen overflow-hidden">
              {children}
            </main>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}