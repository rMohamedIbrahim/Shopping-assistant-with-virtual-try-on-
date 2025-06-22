// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAvatar } from '../hooks/useAvatar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const Profile = () => {
  const { user } = useAuth();
  const { getUserAvatars } = useAvatar();
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('avatars');
  
  useEffect(() => {
    const fetchUserAvatars = async () => {
      try {
        setLoading(true);
        const data = await getUserAvatars();
        setAvatars(data);
      } catch (error) {
        console.error('Error fetching user avatars:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAvatars();
  }, [getUserAvatars]);
  
  const tabs = [
    { id: 'avatars', label: 'My Avatars' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'settings', label: 'Account Settings' }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.username || 'User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {user?.email || 'user@example.com'}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Edit Profile</Button>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'avatars' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Avatars</h2>
            <Button>Create New Avatar</Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : avatars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {avatars.map(avatar => (
                <Card key={avatar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={avatar.imageUrl}
                    alt={avatar.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{avatar.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created: {new Date(avatar.createdAt).toLocaleDateString()}</p>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                      <Button size="sm" className="flex-1">Download</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300 mb-4">You haven't created any avatars yet</p>
              <Button>Create Your First Avatar</Button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'purchases' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Purchase History</h2>
          <p className="text-gray-600 dark:text-gray-300">You haven't made any purchases yet.</p>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button>Update Password</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about account updates and new features</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" id="toggle-notifications" className="sr-only" />
                    <label
                      htmlFor="toggle-notifications"
                      className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                    >
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" id="toggle-theme" className="sr-only" />
                    <label
                      htmlFor="toggle-theme"
                      className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                    >
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h4 className="font-medium text-red-800 dark:text-red-400">Delete Account</h4>
                <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                  This action cannot be undone. All of your data will be permanently deleted.
                </p>
                <Button variant="danger">Delete Account</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;