import { useGLTF } from "@react-three/drei";

const AvatarRenderer = () => {
  const { scene } = useGLTF("/anime_character_model_-_boy.glb");

  // Increase the scale to make it bigger
  scene.scale.set(2, 2, 2); // Adjust as needed
  
  return <primitive object={scene} />;
};

export default AvatarRenderer;
