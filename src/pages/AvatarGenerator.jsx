import React, { useState, useEffect, useRef } from 'react';
import { useAvatar } from '../hooks/useAvatar';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const AvatarGenerator = () => {
  const { user } = useAuth();
  const { generateAvatar, saveAvatar } = useAvatar();
  const [loading, setLoading] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const [formData, setFormData] = useState({
    gender: 'female',
    style: 'realistic',
    hairColor: 'brown',
    skinTone: 'medium',
    age: 'adult',
    expression: 'neutral',
  });
  
  const [styles, setStyles] = useState([
    { id: 'realistic', name: 'Realistic', thumbnail: '/avatars/realistic.jpg' },
    { id: 'anime', name: 'Anime', thumbnail: '/avatars/anime.jpg' },
    { id: 'cartoon', name: 'Cartoon', thumbnail: '/avatars/cartoon.jpg' },
    { id: 'pixar', name: 'Pixar-like', thumbnail: '/avatars/pixar.jpg' },
    { id: 'comic', name: 'Comic', thumbnail: '/avatars/comic.jpg' }
  ]);

  const [hairColors, setHairColors] = useState([
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'blonde', name: 'Blonde', color: '#FFD700' },
    { id: 'red', name: 'Red', color: '#FF4500' },
    { id: 'gray', name: 'Gray', color: '#808080' },
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'blue', name: 'Blue', color: '#1E90FF' },
    { id: 'purple', name: 'Purple', color: '#8A2BE2' },
    { id: 'pink', name: 'Pink', color: '#FF69B4' },
    { id: 'green', name: 'Green', color: '#2E8B57' }
  ]);

  const [skinTones, setSkinTones] = useState([
    { id: 'very-light', name: 'Very Light', color: '#FFE4C4' },
    { id: 'light', name: 'Light', color: '#F5DEB3' },
    { id: 'medium', name: 'Medium', color: '#D2B48C' },
    { id: 'tan', name: 'Tan', color: '#CD853F' },
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'dark', name: 'Dark', color: '#654321' },
    { id: 'very-dark', name: 'Very Dark', color: '#3B2F2F' }
  ]);

  // Refs for three.js
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize three.js scene
  useEffect(() => {
    // Only initialize if the canvas element exists and gender is male
    if (!canvasRef.current || formData.gender !== 'male') return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      canvas: canvasRef.current,
      alpha: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controlsRef.current = controls;
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Load the 3D model - using the fallback directly since the model loading was causing issues
    createFallbackModel();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current && modelRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
    };
  }, [formData.gender]);

  const loadMaleModel = () => {
    if (!sceneRef.current) return;
    
    setLoading(true);
    console.log("Loading 3D model...");
    
    // Clear previous model if it exists
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Instead of trying to load the model that was giving errors,
    // directly create the fallback model as it's more reliable
    createFallbackModel();
    setLoading(false);
  };
  
  // Modified fallback model to make it more avatar-like
  const createFallbackModel = () => {
    if (!sceneRef.current) return;
    
    // Clear previous model if it exists
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Create a character group
    const character = new THREE.Group();
    
    // Create body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.7, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3366cc, 
      metalness: 0.1,
      roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.15;
    character.add(body);
    
    // Create head - select skin color based on the form data
    let skinColor = 0xffcc99; // default
    switch(formData.skinTone) {
      case 'very-light':
        skinColor = 0xffe4c4;
        break;
      case 'light':
        skinColor = 0xf5deb3;
        break;
      case 'medium':
        skinColor = 0xd2b48c;
        break;
      case 'tan':
        skinColor = 0xcd853f;
        break;
      case 'brown':
        skinColor = 0x8b4513;
        break;
      case 'dark':
        skinColor = 0x654321;
        break;
      case 'very-dark':
        skinColor = 0x3b2f2f;
        break;
    }
    
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: skinColor,
      metalness: 0.1,
      roughness: 0.7
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.35;
    character.add(head);
    
    // Create hair - select hair color based on form data
    let hairColor = 0x8b4513; // default brown
    switch(formData.hairColor) {
      case 'black':
        hairColor = 0x000000;
        break;
      case 'brown':
        hairColor = 0x8b4513;
        break;
      case 'blonde':
        hairColor = 0xffd700;
        break;
      case 'red':
        hairColor = 0xff4500;
        break;
      case 'gray':
        hairColor = 0x808080;
        break;
      case 'white':
        hairColor = 0xffffff;
        break;
      case 'blue':
        hairColor = 0x1e90ff;
        break;
      case 'purple':
        hairColor = 0x8a2be2;
        break;
      case 'pink':
        hairColor = 0xff69b4;
        break;
      case 'green':
        hairColor = 0x2e8b57;
        break;
    }
    
    const hairGeometry = new THREE.SphereGeometry(0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMaterial = new THREE.MeshStandardMaterial({ 
      color: hairColor,
      metalness: 0.1,
      roughness: 1.0
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 0.35;
    hair.rotation.x = -0.2;
    character.add(hair);
    
    // Create eyes
    const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeIrisMaterial = new THREE.MeshBasicMaterial({ color: 0x3366cc });
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.08, 0.35, 0.21);
    character.add(leftEye);
    
    // Left iris
    const leftIris = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), eyeIrisMaterial);
    leftIris.position.set(-0.08, 0.35, 0.24);
    character.add(leftIris);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.08, 0.35, 0.21);
    character.add(rightEye);
    
    // Right iris
    const rightIris = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), eyeIrisMaterial);
    rightIris.position.set(0.08, 0.35, 0.24);
    character.add(rightIris);
    
    // Create mouth - expression based
    let mouthY = 0;
    let mouthCurve = 0;
    
    switch(formData.expression) {
      case 'happy':
        mouthCurve = 0.05;
        break;
      case 'sad':
        mouthCurve = -0.05;
        mouthY = -0.02;
        break;
      case 'angry':
        mouthCurve = -0.03;
        mouthY = -0.03;
        break;
      case 'surprised':
        mouthCurve = 0;
        break;
      default: // neutral and others
        mouthCurve = 0;
    }
    
    const mouthShape = new THREE.Shape();
    mouthShape.moveTo(-0.06, mouthY);
    mouthShape.quadraticCurveTo(0, mouthY + mouthCurve, 0.06, mouthY);
    
    const mouthGeometry = new THREE.ShapeGeometry(mouthShape);
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 0.25, 0.24);
    character.add(mouth);
    
    // Add arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ color: bodyMaterial.color });
    
    // Left arm
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 0, 0);
    leftArm.rotation.z = -Math.PI / 4;
    character.add(leftArm);
    
    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 0, 0);
    rightArm.rotation.z = Math.PI / 4;
    character.add(rightArm);
    
    // Add to scene
    sceneRef.current.add(character);
    modelRef.current = character;
    
    // Reset camera and controls
    if (cameraRef.current) {
      cameraRef.current.position.z = 2;
    }
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    
    console.log("Using customized 3D avatar model");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If gender changes to male, we'll update the 3D model
    if (name === 'gender' && value === 'male') {
      // The useEffect will handle initializing the scene
    } else if (modelRef.current && (name === 'hairColor' || name === 'skinTone' || name === 'expression')) {
      // Update the 3D model if these parameters change
      createFallbackModel();
    }
  };

  const handleStyleSelect = (styleId) => {
    setFormData(prev => ({
      ...prev,
      style: styleId
    }));
  };

  const handleGenerateAvatar = async () => {
    // If male is selected, display the 3D model
    if (formData.gender === 'male') {
      if (!modelRef.current) {
        loadMaleModel();
      } else {
        // Update the 3D model with current settings
        createFallbackModel();
      }
      return;
    }
    
    try {
      setLoading(true);
      const avatar = await generateAvatar(formData);
      setGeneratedAvatar(avatar);
      
      // Clear 3D model if it exists
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      // Handle error - show a fallback or error message
      alert("There was an error generating your avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarName.trim()) {
      alert("Please enter a name for your avatar");
      return;
    }

    try {
      setLoading(true);
      await saveAvatar({
        ...generatedAvatar,
        name: avatarName,
        userId: user.id
      });
      setShowModal(false);
      setAvatarName('');
      // Show success message
      alert("Avatar saved successfully!");
    } catch (error) {
      console.error('Error saving avatar:', error);
      alert("There was an error saving your avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel - Customization Controls */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Your Avatar</h2>
          
          <div className="space-y-6">
            {/* Gender Selection */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Gender</label>
              <div className="flex gap-4">
                <label className={`
                  flex-1 p-3 border rounded-md cursor-pointer flex items-center justify-center
                  ${formData.gender === 'male' 
                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'border-gray-300 dark:border-gray-600'}
                `}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="male" 
                    className="sr-only" 
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                  />
                  <span>Male</span>
                </label>
                <label className={`
                  flex-1 p-3 border rounded-md cursor-pointer flex items-center justify-center
                  ${formData.gender === 'female' 
                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'border-gray-300 dark:border-gray-600'}
                `}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="female" 
                    className="sr-only" 
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>
            
            {/* Style Selection */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Style</label>
              <div className="grid grid-cols-3 gap-3">
                {styles.map(style => (
                  <div
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    className={`
                      cursor-pointer rounded-md overflow-hidden border-2 
                      ${formData.style === style.id 
                        ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700' 
                        : 'border-transparent'}
                    `}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img 
                        src={style.thumbnail} 
                        alt={style.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-1 text-xs text-center">{style.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hair Color */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Hair Color</label>
              <div className="grid grid-cols-5 gap-2">
                {hairColors.map(color => (
                  <div 
                    key={color.id}
                    onClick={() => setFormData(prev => ({ ...prev, hairColor: color.id }))}
                    className={`
                      w-8 h-8 rounded-full cursor-pointer border
                      ${formData.hairColor === color.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300 dark:ring-gray-600'}
                    `}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Skin Tone */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Skin Tone</label>
              <div className="grid grid-cols-7 gap-2">
                {skinTones.map(tone => (
                  <div 
                    key={tone.id}
                    onClick={() => setFormData(prev => ({ ...prev, skinTone: tone.id }))}
                    className={`
                      w-8 h-8 rounded-full cursor-pointer border
                      ${formData.skinTone === tone.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300 dark:ring-gray-600'}
                    `}
                    style={{ backgroundColor: tone.color }}
                    title={tone.name}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Age */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Age Group</label>
              <select 
                name="age" 
                value={formData.age} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="child">Child (5-12)</option>
                <option value="teen">Teen (13-19)</option>
                <option value="adult">Adult (20-39)</option>
                <option value="middle-aged">Middle-aged (40-59)</option>
                <option value="senior">Senior (60+)</option>
              </select>
            </div>
            
            {/* Expression */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Expression</label>
              <select 
                name="expression" 
                value={formData.expression} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="serious">Serious</option>
                <option value="surprised">Surprised</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
              </select>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleGenerateAvatar} className="w-full">
                {loading ? 'Generating...' : 'Generate Avatar'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Preview */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Avatar Preview</h2>
            
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
              {loading ? (
                <Loader size="lg" />
              ) : generatedAvatar ? (
                <div className="text-center">
                  <img 
                    src={generatedAvatar.imageUrl} 
                    alt="Generated Avatar" 
                    className="max-h-96 mx-auto rounded-lg shadow-lg"
                  />
                  <div className="mt-6">
                    <Button onClick={() => setShowModal(true)} className="mx-2">
                      Save Avatar
                    </Button>
                    <Button variant="outline" onClick={handleGenerateAvatar} className="mx-2">
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : formData.gender === 'male' ? (
                <canvas 
                  ref={canvasRef} 
                  className="w-full"
                  style={{ height: "400px" }}
                />
              ) : (
                <div className="text-center p-8">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Customize your avatar's appearance using the options on the left, then click "Generate Avatar"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Avatar Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Save Your Avatar"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Avatar Name
            </label>
            <input
              type="text"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              placeholder="Enter a name for your avatar"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAvatar} disabled={loading}>
              {loading ? 'Saving...' : 'Save Avatar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AvatarGenerator;