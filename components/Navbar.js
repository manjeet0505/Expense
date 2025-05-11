'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Budget', href: '/budget', icon: ChartBarIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[96vw] max-w-3xl bg-gradient-to-r from-indigo-100/80 via-purple-100/80 to-pink-100/80 bg-opacity-90 backdrop-blur-2xl shadow-xl border border-indigo-200/40 rounded-2xl transition-all duration-500 px-2 sm:px-4">
      <div className="flex items-center justify-between w-full h-14">
        <Link href="/" className="flex items-center group select-none">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">ExpenseX</span>
        </Link>
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white/90 text-indigo-700 shadow scale-105 border border-indigo-200'
                    : 'text-gray-700 hover:bg-white/60 hover:text-indigo-600 hover:shadow'
                }`}
                style={{ minWidth: 80, justifyContent: 'center' }}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-indigo-400 group-hover:text-indigo-600'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="hidden md:flex ml-2 flex-shrink-0">
          {user ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition-all duration-300 border border-indigo-200/60 text-base"
              style={{ minWidth: 90, justifyContent: 'center' }}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1 text-white" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href="/auth/signup"
              className="flex items-center px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition-all duration-300 border border-indigo-200/60 text-base"
              style={{ minWidth: 90, justifyContent: 'center' }}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1 text-white" />
              <span>Sign Up</span>
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
          aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-7 w-7 text-indigo-700" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-indigo-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-indigo-200/40 py-2 px-4">
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-indigo-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-indigo-100">
              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 