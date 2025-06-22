// src/pages/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { avatarService } from '../services/avatarService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const Gallery = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    style: 'all',
    gender: 'all',
  });
  
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        setLoading(true);
        const data = await avatarService.getAvatars(filters);
        setAvatars(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching avatars:', err);
        setError('Failed to load avatars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvatars();
  }, [filters]);
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Avatar Gallery</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Style
            </label>
            <select
              value={filters.style}
              onChange={(e) => handleFilterChange('style', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Styles</option>
              <option value="cartoon">Cartoon</option>
              <option value="realistic">Realistic</option>
              <option value="anime">Anime</option>
              <option value="pixel">Pixel Art</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Avatar Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-700 dark:text-red-200 text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {avatars.map((avatar) => (
            <Card key={avatar.id} className="overflow-hidden">
              <img 
                src={avatar.imageUrl}
                alt={avatar.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {avatar.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {avatar.style}
                </p>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    Customize
                  </Button>
                  <Button size="sm">
                    Use
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {avatars.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No avatars found with the selected filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;