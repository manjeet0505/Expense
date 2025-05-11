'use client';
import { useState, useEffect, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { UserIcon, GlobeAltIcon, HeartIcon, ArrowLeftOnRectangleIcon, PencilIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [lang, setLang] = useState('English');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (user?.name) setForm(f => ({ ...f, name: user.name }));
  }, [user]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setError('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: user.email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile update response:', data);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setShowEdit(false);
      
      // Update the user state with new data
      setUser(prev => ({
        ...prev,
        name: form.name,
        email: user.email
      }));
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Change password logic
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: '', // आप चाहें तो current password भी मांग सकते हैं
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password update failed');
      setMessage('Password updated successfully!');
      setPasswordForm({ newPassword: '', confirm: '' });
      setShowPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-28 pb-8 px-4">
      {/* Header */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 mb-4">
          <img
            src={user.image || '/default-avatar.png'}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Options List */}
      <div className="w-full max-w-sm mx-auto mt-6 bg-white rounded-2xl shadow divide-y divide-gray-100">
        <button onClick={() => setShowEdit(true)} className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none">
          <PencilIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Edit profile</span>
        </button>
        <button onClick={() => setShowLang(true)} className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none">
          <GlobeAltIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Language</span>
        </button>
        <button className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none rounded-b-2xl" onClick={() => setShowPassword(true)}>
          <KeyIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Change Password</span>
        </button>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full max-w-sm mx-auto mt-8 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white" />
        Logout
      </button>

      {/* Edit Profile Modal/Section */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-700"
                  autoComplete="name"
                  placeholder="Enter your name"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {message.text && (
                <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {message.text}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLang && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center">Select Language</h2>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-4"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => setShowLang(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  autoComplete="new-password"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {message.text && (
                <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {message.text}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowPassword(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">{loading ? 'Saving...' : 'Change'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 