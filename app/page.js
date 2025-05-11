'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  BellIcon, 
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  ChartPieIcon,
  CogIcon,
  UserIcon,
  WalletIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const router = useRouter();
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const contactFormRef = useRef();

  const currencies = ['INR', 'EUR', 'GBP', 'JPY'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', icon: <HomeIcon className="w-5 h-5" />, label: 'Home', href: '/' },
    { id: 'dashboard', icon: <WalletIcon className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
    { id: 'analytics', icon: <ChartPieIcon className="w-5 h-5" />, label: 'Analytics', href: '/analytics' },
    { id: 'transactions', icon: <DocumentTextIcon className="w-5 h-5" />, label: 'Transactions', href: '/transactions' },
    { id: 'profile', icon: <UserIcon className="w-5 h-5" />, label: 'Profile', href: '/profile' },
  ];

  const features = [
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: "Smart Expense Tracking",
      description: "Track your daily expenses with our intuitive interface and smart categorization."
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get detailed insights about your spending patterns with beautiful charts and reports."
    },
    {
      icon: <BellIcon className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Stay informed with real-time alerts about your budget and spending habits."
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with advanced encryption and security measures."
    }
  ];

  const benefits = [
    {
      icon: <ArrowTrendingUpIcon className="w-8 h-8" />,
      title: "Save More",
      description: "Identify spending patterns and save more with our smart insights."
    },
    {
      icon: <BanknotesIcon className="w-8 h-8" />,
      title: "Budget Better",
      description: "Create and manage budgets that work for your lifestyle."
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Family Sharing",
      description: "Share expenses and manage finances together with your family."
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      title: "Mobile First",
      description: "Access your finances on the go with our mobile-friendly interface."
    }
  ];

  const addExpense = (e) => {
    e.preventDefault();
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
    setNewExpense({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMsg('');
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setContactMsg('Message sent successfully!');
      form.reset();
    } catch (err) {
      setContactMsg('Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-4 pt-32 pb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Take Control of Your
            <span className="block mt-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Financial Future</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Track expenses, set budgets, and achieve your financial goals with our powerful personal finance tracker.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.a
              href="/dashboard"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500 hover:text-white hover:scale-105 transition-all duration-300 border-2 border-indigo-100"
              whileHover={{ scale: 1.07, boxShadow: '0 4px 32px 0 #a5b4fc' }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free
            </motion.a>
            <motion.a
              href="/demo"
              className="inline-block bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-indigo-700 hover:scale-105 transition-all duration-300 border-2 border-indigo-100"
              whileHover={{ scale: 1.07, boxShadow: '0 4px 32px 0 #f0abfc' }}
              whileTap={{ scale: 0.97 }}
            >
              Watch Demo
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Wave Background */}
      <div className="relative w-full -mt-12 mb-8">
        <svg className="w-full h-24 md:h-32 lg:h-40" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#a5b4fc" fillOpacity="0.4">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M0,160L60,170C120,180,240,200,360,197.3C480,195,600,169,720,154.7C840,140,960,138,1080,154.7C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
              M0,192L60,186.7C120,181,240,171,360,154.7C480,139,600,117,720,128C840,139,960,181,1080,202.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
              M0,160L60,170C120,180,240,200,360,197.3C480,195,600,169,720,154.7C840,140,960,138,1080,154.7C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </path>
        </svg>
      </div>

      {/* Features Section */}
      <motion.div
        className="container mx-auto px-4 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-16 drop-shadow-lg">
          Why Choose Our Finance Tracker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card-glass p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-100 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.06, boxShadow: '0 8px 32px 0 #a5b4fc' }}
            >
              <div className="text-indigo-600 mb-6 text-3xl group-hover:text-pink-500 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-3 group-hover:drop-shadow-lg">
                {feature.title}
              </h3>
              <p className="text-gray-700 group-hover:text-indigo-700 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Section */}
      {/* ... यह पूरा सेक्शन हटा दें ... */}

      {/* Benefits Section */}
      <motion.div
        className="container mx-auto px-4 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent mb-16 drop-shadow-lg">
          Benefits You'll Love
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="card-glass p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-pink-100 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.06, boxShadow: '0 8px 32px 0 #f0abfc' }}
            >
              <div className="text-pink-500 mb-6 text-3xl group-hover:text-indigo-600 transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent mb-3 group-hover:drop-shadow-lg">
                {benefit.title}
              </h3>
              <p className="text-gray-700 group-hover:text-pink-700 transition-colors duration-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        {/* Background Elements */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.span
                className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                Start Your Journey Today
              </motion.span>
              <motion.h2 
                className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Ready to Transform Your Financial Future?
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Join thousands of users who are already managing their finances better and achieving their financial goals with our powerful tools.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.a 
                href="/auth/login" 
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                />
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <motion.svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.a>

              <motion.a 
                href="/contact" 
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-indigo-600 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-indigo-100"
              >
                <span className="relative z-10 flex items-center">
                  Contact Sales
                  <motion.svg
                    className="w-5 h-5 ml-2 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </motion.svg>
                </span>
              </motion.a>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center justify-center space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-600"
              >
                <ShieldCheckIcon className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">Secure & Private</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-600"
              >
                <UserGroupIcon className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">10,000+ Users</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-600"
              >
                <StarIcon className="w-5 h-5 text-indigo-500" />
                <span className="text-sm">4.9/5 Rating</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
    </motion.div>

      {/* Footer */}
      <motion.footer 
        className="bg-white/80 card-glass border-t border-indigo-100 py-16 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Expense Tracker</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Take control of your finances with our powerful expense tracking solution.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <motion.a
                    href="/dashboard"
                    whileHover={{ x: 5 }}
                    className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center group"
                  >
                    <WalletIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-600" />
                    Dashboard
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="/profile"
                    whileHover={{ x: 5 }}
                    className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center group"
                  >
                    <UserIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-600" />
                    Profile
                  </motion.a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <a href="mailto:mishramanjeet26@gmail.com" className="hover:text-indigo-600">mishramanjeet26@gmail.com</a>
                </li>
                <li className="flex items-center text-gray-600">
                  <PhoneIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <a href="tel:+919540932794" className="hover:text-indigo-600">+91 9540932794</a>
                </li>
                <li className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="mr-2">My Location</span>
                </li>
                <li>
                  <iframe
                    title="Gurugram Sector 15 Location"
                    src="https://www.google.com/maps?q=28.4595,77.0266&z=15&output=embed"
                    width="100%"
                    height="120"
                    style={{ border: 0, borderRadius: '0.5rem' }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </li>
              </ul>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Form</h3>
              <form className="space-y-4" onSubmit={handleContactSubmit} ref={contactFormRef}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"
                  rows={3}
                  required
                />
                {contactMsg && <div className={`text-sm ${contactMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{contactMsg}</div>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={contactLoading}
                  className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-60"
                >
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-100 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © 2024 Expense Tracker. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <motion.a
                  href="/privacy"
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-500 hover:text-indigo-600 text-sm transition-colors"
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="/terms"
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-500 hover:text-indigo-600 text-sm transition-colors"
                >
                  Terms of Service
                </motion.a>
                <motion.a
                  href="/cookies"
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-500 hover:text-indigo-600 text-sm transition-colors"
                >
                  Cookie Policy
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
