import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AvatarRenderer from "./AvatarRenderer";

const AvatarCanvas = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} />
      <AvatarRenderer />
      <OrbitControls />
    </Canvas>
  );
};

export default AvatarCanvas;
