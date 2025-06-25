import React, { useState } from 'react';
import axios from 'axios';
import './addproduct.css';

const ProductUploadForm = () => {
  const initialSizes = ["26", "28", "30", "32", "34", "36", "38", "40"].reduce(
    (acc, size) => ({ ...acc, [size]: '' }),
    {}
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    sizes: initialSizes,
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeStockChange = (e, size) => {
    const stock = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: stock,
      },
    }));
  };

const handleImageChange = (e) => {
  const newFiles = Array.from(e.target.files);

  // Filter duplicates by name + size
  const uniqueNewFiles = newFiles.filter(
    (file) => !formData.images.some((f) => f.name === file.name && f.size === file.size)
  );

  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...uniqueNewFiles],
  }));

  const newPreviews = uniqueNewFiles.map((file) => URL.createObjectURL(file));
  setPreviewImages((prev) => [...prev, ...newPreviews]);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('originalPrice', formData.originalPrice);
    data.append('category', formData.category);

    const sizeStockArray = Object.entries(formData.sizes)
      .filter(([_, stock]) => stock !== '' && !isNaN(stock))
      .map(([size, stock]) => ({
        size,
        stock: parseInt(stock, 10),
      }));

    data.append('sizes', JSON.stringify(sizeStockArray));
    formData.images.forEach((file) => data.append('images', file));

    try {
      const token = localStorage.getItem('token');
const res = await axios.post(
  `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products`,
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
        },
      });
      alert('Product uploaded successfully!');
      console.log(res.data);
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Server response:", error.response?.data);
      alert(error.response?.data?.message || 'Product upload failed');
    }
  };

  return (
    <div className="add-product-card">
      <form onSubmit={handleSubmit} className="add-product-form">
        <h2 className="add-product-title">Upload Product</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />

        <label>Original Price</label>
        <input
          type="number"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleInputChange}
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        />

        <label>Sizes and Stock</label>
        <div className="add-product-sizes-grid">
          {Object.keys(formData.sizes).map((size) => (
            <div key={size} className="flex items-center gap-2">
              <label>{size}:</label>
              <input
                type="number"
                min="0"
                value={formData.sizes[size]}
                onChange={(e) => handleSizeStockChange(e, size)}
                placeholder="Stock"
              />
            </div>
          ))}
        </div>

        <label>Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* ✅ Preview section */}
        {previewImages.length > 0 && (
          <div className="image-preview-grid">
            {previewImages.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} />
            ))}
          </div>
        )}

        <button type="submit" className="add-product-btn">
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default ProductUploadForm;
