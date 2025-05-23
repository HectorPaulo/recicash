import { useState } from "react";
import axios from "axios";

const ProductoImagen = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(
      `${import.meta.env.VITE_API_URL}/files/product`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    alert("Imagen subida");
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
};

export default ProductoImagen;
