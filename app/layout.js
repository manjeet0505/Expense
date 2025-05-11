import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import Navbar from '@/components/Navbar';
import ClientSessionProvider from './ClientSessionProvider';
import { UserProvider } from '../context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and manage your finances",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        <ClientSessionProvider>
          <UserProvider>
            <Navbar />
            <ClientLayout>{children}</ClientLayout>
          </UserProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}