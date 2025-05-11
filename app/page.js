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
                  href="https://www.linkedin.com/in/manjeet-mishra-175705260/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://github.com/manjeet0505"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://twitter.com/mishramanjeet26"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.924 2.206-4.924 4.924 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.318-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.179 1.397 4.768 2.213 7.557 2.213 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.016-.634.962-.689 1.797-1.56 2.457-2.548z"/>
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Expense Tracker</span>
                </div>
                <p className="text-gray-600 text-center md:text-left">Track your expenses, manage your budget, and achieve your financial goals.</p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-4">
                <div className="flex gap-4">
                  <motion.a
                    href="https://www.linkedin.com/in/mishramanjeet26/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://github.com/mishramanjeet26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://twitter.com/mishramanjeet26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </motion.a>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-gray-600">
                  <motion.a
                    href="/privacy"
                    className="hover:text-indigo-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Privacy Policy
                  </motion.a>
                  <motion.a
                    href="/cookies"
                    className="hover:text-indigo-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cookie Policy
                  </motion.a>
                  <motion.a
                    href="/terms"
                    className="hover:text-indigo-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Terms of Service
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
