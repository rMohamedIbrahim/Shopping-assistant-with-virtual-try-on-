import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const TryOn = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Sample outfit data - in a real app, this would come from an API
  const outfits = [
    { id: 1, name: 'Casual Summer', thumbnail: '/images/outfits/casual-summer.jpg', category: 'casual' },
    { id: 2, name: 'Business Formal', thumbnail: '/images/outfits/business-formal.jpg', category: 'formal' },
    { id: 3, name: 'Athletic Wear', thumbnail: '/images/outfits/athletic.jpg', category: 'athletic' },
    { id: 4, name: 'Evening Gala', thumbnail: '/images/outfits/evening-gala.jpg', category: 'formal' },
    { id: 5, name: 'Weekend Casual', thumbnail: '/images/outfits/weekend-casual.jpg', category: 'casual' },
    { id: 6, name: 'Beach Day', thumbnail: '/images/outfits/beach-day.jpg', category: 'casual' }
  ];
  
  const [filteredOutfits, setFilteredOutfits] = useState(outfits);
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    // Load user's avatar if available
    if (user && user.profileImage) {
      setAvatarImage(user.profileImage);
    }
  }, [user]);
  
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredOutfits(outfits);
    } else {
      setFilteredOutfits(outfits.filter(outfit => outfit.category === activeCategory));
    }
  }, [activeCategory]);
  
  const handleOutfitSelect = (outfit) => {
    setSelectedOutfit(outfit);
    setGeneratedImage(null); // Reset generated image when new outfit selected
  };
  
  const handleAvatarUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setAvatarImage(event.target.result);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerate = async () => {
    if (!avatarImage || !selectedOutfit) {
      setError('Please select both an avatar image and an outfit');
      return;
    }
    
    setError(null);
    setProcessing(true);
    
    try {
      // In a real app, you would make an API call to your backend service
      // This is just a simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a generated image (in a real app, this would come from your API)
      setGeneratedImage(`/images/generated/avatar-outfit-${selectedOutfit.id}.jpg`);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleSaveToGallery = async () => {
    if (!generatedImage) return;
    
    setLoading(true);
    
    try {
      // In a real app, you would make an API call to save to the user's gallery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Saved to your gallery successfully!');
    } catch (err) {
      setError('Failed to save to gallery. Please try again.');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    { id: 'all', label: 'All Outfits' },
    { id: 'casual', label: 'Casual' },
    { id: 'formal', label: 'Formal' },
    { id: 'athletic', label: 'Athletic' }
  ];
  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Virtual Try-On</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar Upload */}
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Avatar</h2>
            
            <div className="flex flex-col items-center space-y-4">
              {avatarImage ? (
                <div className="w-full aspect-square max-w-xs bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={avatarImage} 
                    alt="Your avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square max-w-xs bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-6">
                    Upload an avatar image or use your profile picture
                  </p>
                </div>
              )}
              
              <Button
                variant="outline"
                className="relative overflow-hidden"
                size="sm"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                Upload Avatar Image
              </Button>
              
              {user.profileImage && avatarImage !== user.profileImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAvatarImage(user.profileImage)}
                >
                  Use Profile Picture
                </Button>
              )}
            </div>
          </Card>
          
          {/* Generate Button */}
          <Card className="p-6">
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={!avatarImage || !selectedOutfit || processing}
              >
                {processing ? 'Generating...' : 'Generate Try-On Image'}
              </Button>
              
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Please select both an avatar and an outfit to generate a try-on image.
              </p>
            </div>
          </Card>
        </div>
        
        {/* Middle Column - Outfit Selection */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Outfit</h2>
            
            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-3 py-1 rounded-full text-sm whitespace-nowrap
                    ${activeCategory === category.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            {/* Outfit Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredOutfits.map(outfit => (
                <button
                  key={outfit.id}
                  onClick={() => handleOutfitSelect(outfit)}
                  className={`
                    p-2 rounded-lg transition-all
                    ${selectedOutfit?.id === outfit.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-2">
                    <img 
                      src={outfit.thumbnail} 
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder-outfit.jpg';
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium text-center truncate">{outfit.name}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right Column - Generated Result */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Result</h2>
            
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              {processing ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated outfit" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder-result.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-6">
                    Your try-on result will appear here after generation
                  </p>
                </div>
              )}
            </div>
            
            {generatedImage && (
              <div className="flex justify-center space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Create a download link
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = 'tryOn-' + selectedOutfit.name.toLowerCase().replace(/\s+/g, '-') + '.jpg';
                    link.click();
                  }}
                >
                  Download
                </Button>
                
                <Button
                  onClick={handleSaveToGallery}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save to Gallery'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TryOn;