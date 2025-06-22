import { useContext } from "react";
import AvatarContext from "../../context/AvatarContext";

const AccessoriesPanel = () => {
  const { updateAvatar } = useContext(AvatarContext);
  const accessories = ["Glasses", "Hat", "Earrings"];

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Accessories</h2>
      <div className="flex gap-2 mt-2">
        {accessories.map((item, idx) => (
          <button key={idx} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-700" onClick={() => updateAvatar("accessories", item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesPanel;
