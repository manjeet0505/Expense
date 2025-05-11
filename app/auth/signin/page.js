'use client';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Sign in to manage your expenses</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="w-6 h-6" />
          <span className="font-medium">Continue with Google</span>
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 