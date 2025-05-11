'use client';
import { useState, useEffect, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { UserIcon, GlobeAltIcon, HeartIcon, ArrowLeftOnRectangleIcon, PencilIcon, KeyIcon } from '@heroicons/react/24/outline';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import Slider from '@mui/material/Slider';
import { Dialog } from '@headlessui/react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [lang, setLang] = useState('English');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (user?.image) setImagePreview(user.image);
    if (user?.name) setForm(f => ({ ...f, name: user.name, image: user.image }));
  }, [user]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Edit profile logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels);
      setImagePreview(croppedImage);
      setShowCropper(false);
      // Convert base64 to File for upload
      const res = await fetch(croppedImage);
      const blob = await res.blob();
      setImageFile(new File([blob], 'cropped-image.png', { type: blob.type }));
    } catch (e) {
      setShowCropper(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    let imageUrl = form.image;
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const res = await fetch('/api/profile/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image upload failed');
        imageUrl = data.url;
      }
      const res2 = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, image: imageUrl }),
      });
      const data2 = await res2.json();
      if (!res2.ok) throw new Error(data2.error || 'Update failed');
      setMessage('Profile updated successfully!');
      setUser({ name: form.name, image: imageUrl, email: user.email });
      setShowEdit(false);
      setImageFile(null);
    } catch (err) {
      setError(err.message);
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
            src={imagePreview || '/default-avatar.png'}
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
              <div className="flex flex-col items-center">
                <img
                  src={imagePreview || '/default-avatar.png'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
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
              {message && <div className="text-green-600 text-sm">{message}</div>}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
            {/* Cropper Modal */}
            {showCropper && (
              <Dialog open={showCropper} onClose={() => setShowCropper(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black bg-opacity-40" />
                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[320px] flex flex-col items-center">
                  <div className="relative w-56 h-56 bg-gray-100 rounded-lg overflow-hidden">
                    <Cropper
                      image={imagePreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="w-full mt-4">
                    <Slider
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(_, value) => setZoom(value)}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={() => setShowCropper(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
                    <button type="button" onClick={handleCropSave} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">Crop & Save</button>
                  </div>
                </div>
              </Dialog>
            )}
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
              {message && <div className="text-green-600 text-sm">{message}</div>}
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