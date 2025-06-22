// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  const features = [
    {
      title: 'AI Avatar Generator',
      description: 'Create stunning, personalized avatars with our AI technology',
      icon: '🤖',
      link: '/avatar-generator'
    },
    {
      title: 'Virtual Try-On',
      description: 'Try clothes and accessories on your avatar before you buy',
      icon: '👕',
      link: '/try-on'
    },
    {
      title: 'Avatar Gallery',
      description: 'Browse through our collection of pre-made avatars and styles',
      icon: '🖼️',
      link: '/gallery'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Create Your Digital Identity
              </h1>
              <p className="text-xl text-gray-100 mb-8">
                Generate stunning avatars powered by AI. Customize looks, try on outfits, and express yourself digitally.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link to="/avatar-generator">
                  <Button size="lg">Create Avatar</Button>
                </Link>
                <Link to="/gallery">
                  <Button size="lg" variant="outline">Explore Gallery</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/avatars/hero.png" 
                alt="Avatar examples" 
                className="rounded-lg shadow-2xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Features</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Everything you need to create and customize your digital identity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                <Link to={feature.link}>
                  <Button variant="link">Learn more →</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Create your perfect avatar in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload a Photo</h3>
              <p className="text-gray-600 dark:text-gray-300">Upload your photo or start from scratch</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Customize</h3>
              <p className="text-gray-600 dark:text-gray-300">Adjust features, hairstyles, and more</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Download & Share</h3>
              <p className="text-gray-600 dark:text-gray-300">Get your avatar in multiple formats</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to create your own avatar?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who have already created their perfect digital identity.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;