import { useContext } from "react";
import AvatarContext from "../../context/AvatarContext";

const ClothingPanel = () => {
  const { updateAvatar } = useContext(AvatarContext);
  const clothes = ["T-shirt", "Jacket", "Hoodie", "Dress"];

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Choose Clothing</h2>
      <div className="flex gap-2 mt-2">
        {clothes.map((item, idx) => (
          <button key={idx} className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => updateAvatar("clothing", item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClothingPanel;
