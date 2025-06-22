// src/services/avatarService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const generateAvatar = async (customizations) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/avatars/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(customizations),
    });

    if (!response.ok) {
      throw new Error('Avatar generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Avatar generation error:', error);
    
    // Demo fallback
    return {
      id: Math.random().toString(36).substring(7),
      imageUrl: `/assets/avatars/avatar-${Math.floor(Math.random() * 5) + 1}.png`,
      model3dUrl: '/avatar.glb',
      customizations,
      createdAt: new Date().toISOString()
    };
  }
};

export const saveAvatar = async (avatar) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/avatars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(avatar),
    });

    if (!response.ok) {
      throw new Error('Failed to save avatar');
    }

    return await response.json();
  } catch (error) {
    console.error('Save avatar error:', error);
    
    // Demo fallback
    return {
      ...avatar,
      id: Math.random().toString(36).substring(7),
      savedAt: new Date().toISOString()
    };
  }
};

export const getUserAvatars = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/avatars`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch avatars');
    }

    return await response.json();
  } catch (error) {
    console.error('Get avatars error:', error);
    
    // Demo fallback
    return Array(5).fill().map((_, i) => ({
      id: `demo-avatar-${i}`,
      imageUrl: `/assets/avatars/avatar-${i + 1}.png`,
      model3dUrl: '/avatar.glb',
      customizations: {
        hairStyle: ['short', 'long', 'curly', 'wavy', 'ponytail'][i],
        hairColor: ['#000000', '#6b3e26', '#e6c39c', '#cc0000', '#7b3f00'][i],
        skinTone: '#f5d0c5',
        eyeColor: ['#6b3e26', '#2b5329', '#a9c8e3', '#5f4c3f', '#634e34'][i],
        outfit: ['casual', 'formal', 'sporty', 'punk', 'business'][i],
        accessories: []
      },
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    }));
  }
};