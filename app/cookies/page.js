'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      <motion.div 
        className="container mx-auto px-4 py-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-indigo-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. What Are Cookies</h2>
              <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and enable certain features to function properly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential cookies for website functionality</li>
                <li>Authentication and security</li>
                <li>Remembering your preferences</li>
                <li>Analyzing website usage</li>
                <li>Improving user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Essential Cookies</h3>
                  <p>Required for the website to function properly. These cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Functional Cookies</h3>
                  <p>Remember your preferences and settings to enhance your experience.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Analytics Cookies</h3>
                  <p>Help us understand how visitors interact with our website.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Managing Cookies</h2>
              <p>You can control and manage cookies in your browser settings. However, please note that disabling certain cookies may affect the functionality of our website.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Updates to This Policy</h2>
              <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
              <p>If you have any questions about our Cookie Policy, please contact us at:</p>
              <p className="mt-2">Email: mishramanjeet26@gmail.com</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 