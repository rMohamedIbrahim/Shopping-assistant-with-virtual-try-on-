import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const Settings = () => {
  const { user, updateUserProfile, updatePassword, updateEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    fullName: '',
    bio: '',
    profileImage: null
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    email: '',
    confirmEmail: '',
    password: ''
  });
  
  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    newFeatures: true,
    marketingEmails: false,
    activitySummary: true
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showAvatarsInGallery: true,
    allowDataCollection: true
  });
  
  // Display preferences state
  const [displayPreferences, setDisplayPreferences] = useState({
    theme: 'system',
    language: 'en',
    avatarDisplaySize: 'medium'
  });
  
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        fullName: user.fullName || '',
        bio: user.bio || '',
        profileImage: null
      });
      
      setEmailForm({
        email: user.email || '',
        confirmEmail: '',
        password: ''
      });
      
      // In a real app, you would fetch these preferences from the server
      // This is just a placeholder
    }
  }, [user]);
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(profileForm);
      setProfileUpdated(true);
      setTimeout(() => setProfileUpdated(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // Show error
      return;
    }
    
    try {
      setLoading(true);
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordUpdated(true);
      setTimeout(() => setPasswordUpdated(false), 3000);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailForm.email !== emailForm.confirmEmail) {
      // Show error
      return;
    }
    
    try {
      setLoading(true);
      await updateEmail(emailForm.email, emailForm.password);
      setEmailUpdated(true);
      setTimeout(() => setEmailUpdated(false), 3000);
      setEmailForm({
        ...emailForm,
        confirmEmail: '',
        password: ''
      });
    } catch (error) {
      console.error('Error updating email:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileForm(prev => ({
        ...prev,
        profileImage: e.target.files[0]
      }));
    }
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleDisplayChange = (e) => {
    const { name, value } = e.target;
    setDisplayPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const sections = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'account', label: 'Account Security' },
    { id: 'notifications', label: 'Notification Preferences' },
    { id: 'privacy', label: 'Privacy & Sharing' },
    { id: 'display', label: 'Display Settings' },
    { id: 'data', label: 'Data Management' }
  ];
  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm font-medium
                ${activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}
              `}
            >
              {section.label}
            </button>
          ))}
        </div>
        
        {/* Settings Content */}
        <div className="flex-1">
          <Card className="p-6">
            {/* Profile Information */}
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                
                {profileUpdated && (
                  <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                    Profile updated successfully!
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-6">
                    <div className="flex items-center">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="w-24 h-24 rounded-full object-cover mr-6"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mr-6">
                          <span className="text-2xl font-bold text-white">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <Button
                          variant="outline"
                          className="relative overflow-hidden mb-2"
                          size="sm"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          Change Profile Picture
                        </Button>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Account Security */}
            {activeSection === 'account' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Security</h2>
                
                {/* Change Password */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                  
                  {passwordUpdated && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                      Password updated successfully!
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </div>
                
                {/* Change Email */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Email</h3>
                  
                  {emailUpdated && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                      Email updated successfully!
                    </div>
                  )}
                  
                  <form onSubmit={handleEmailSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={emailForm.email}
                          onChange={handleEmailChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Email
                        </label>
                        <input
                          type="email"
                          name="confirmEmail"
                          value={emailForm.confirmEmail}
                          onChange={handleEmailChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={emailForm.password}
                          onChange={handleEmailChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Email'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Notification Preferences */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive important updates about your account</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        name="emailNotifications"
                        checked={notificationPreferences.emailNotifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <label
                        htmlFor="emailNotifications"
                        className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">New Features</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to know about new features and updates</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id="newFeatures" 
                        name="newFeatures"
                        checked={notificationPreferences.newFeatures}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <label
                        htmlFor="newFeatures"
                        className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotions and special offers</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id="marketingEmails" 
                        name="marketingEmails"
                        checked={notificationPreferences.marketingEmails}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <label
                        htmlFor="marketingEmails"
                        className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Activity Summary</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly summaries of your account activity</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id="activitySummary" 
                        name="activitySummary"
                        checked={notificationPreferences.activitySummary}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <label
                        htmlFor="activitySummary"
                        className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            )}
            
            {/* Privacy & Sharing */}
            {activeSection === 'privacy' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Sharing</h2>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profile Visibility</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Control who can see your profile</p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="public"
                          checked={privacySettings.profileVisibility === 'public'}
                          onChange={handlePrivacyChange}
                          className="mr-2"
                        />
                        <span>Public</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="friends"
                          checked={privacySettings.profileVisibility === 'friends'}
                          onChange={handlePrivacyChange}
                          className="mr-2"
                        />
                        <span>Friends Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={privacySettings.profileVisibility === 'private'}
                          onChange={handlePrivacyChange}
                          className="mr-2"
                        />
                        <span>Private</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Show Avatars in Public Gallery</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow your avatars to be displayed in the public gallery</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id="showAvatarsInGallery" 
                        name="showAvatarsInGallery"
                        checked={privacySettings.showAvatarsInGallery}
                        onChange={handlePrivacyChange}
                        className="sr-only peer" 
                      />
                      <label
                        htmlFor="showAvatarsInGallery"
                        className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Allow Anonymous Data Collection</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve our services through anonymous usage data</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id="allowDataCollection" 
                        name="allowDataCollection"
                        checked={privacySettings.allowDataCollection}
                        onChange={handlePrivacyChange}
                        className="sr-only peer" 
                      />
                      <label
                        htmlFor="allowDataCollection"
                        className="block bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Save Privacy Settings</Button>
                </div>
              </div>
            )}
            
            {/* Display Settings */}
            {activeSection === 'display' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Display Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Theme</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose your preferred theme</p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={displayPreferences.theme === 'light'}
                          onChange={handleDisplayChange}
                          className="mr-2"
                        />
                        <span>Light</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={displayPreferences.theme === 'dark'}
                          onChange={handleDisplayChange}
                          className="mr-2"
                        />
                        <span>Dark</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="system"
                          checked={displayPreferences                          .theme === 'system'}
                          onChange={handleDisplayChange}
                          className="mr-2"
                        />
                        <span>System</span>
                      </label>
                    </div>
                  </div>

                  {/* Font Size Settings */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Font Size</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Adjust the font size for better readability.
                    </p>
                    <select
                      name="fontSize"
                      value={displayPreferences.fontSize}
                      onChange={handleDisplayChange}
                      className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Layout Preferences */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Layout Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Choose between a compact or spacious layout.
                    </p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="compact"
                          checked={displayPreferences.layout === 'compact'}
                          onChange={handleDisplayChange}
                          className="mr-2"
                        />
                        <span>Compact</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="spacious"
                          checked={displayPreferences.layout === 'spacious'}
                          onChange={handleDisplayChange}
                          className="mr-2"
                        />
                        <span>Spacious</span>
                      </label>
                    </div>
                  </div>

                  {/* Toggle Animations */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Enable Animations</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle animations for UI elements.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={displayPreferences.animations}
                        onChange={handleDisplayChange}
                        name="animations"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 
                      rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                      after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Settings;

