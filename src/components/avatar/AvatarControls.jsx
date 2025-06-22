import { useContext } from "react";
import AvatarContext from "../../context/AvatarContext";
import Slider from "../common/Slider";
import ColorPicker from "../common/ColorPicker";

const AvatarControls = () => {
  const { avatarSettings, updateAvatar } = useContext(AvatarContext);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Customize Avatar</h2>
      <Slider label="Size" min={0.5} max={2} step={0.1} value={avatarSettings.size} onChange={(val) => updateAvatar("size", val)} />
      <ColorPicker label="Skin Color" value={avatarSettings.skinColor} onChange={(val) => updateAvatar("skinColor", val)} />
    </div>
  );
};

export default AvatarControls;
