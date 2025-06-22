// src/context/AvatarContext.jsx
import { createContext, useState } from 'react';

export const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [avatarHistory, setAvatarHistory] = useState([]);
  const [customizations, setCustomizations] = useState({
    hairStyle: 'default',
    hairColor: '#000000',
    skinTone: '#f5d0c5',
    eyeColor: '#6b3e26',
    outfit: 'casual',
    accessories: []
  });

  const saveAvatar = (avatar) => {
    setAvatarHistory(prev => [...prev, avatar]);
    setCurrentAvatar(avatar);
  };

  const updateCustomizations = (updates) => {
    setCustomizations(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <AvatarContext.Provider 
      value={{ 
        currentAvatar, 
        avatarHistory, 
        customizations,
        saveAvatar, 
        updateCustomizations,
        setCurrentAvatar
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};