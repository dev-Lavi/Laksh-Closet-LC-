import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './addproduct.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    sizes: '',
    images: [],
  });

  const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'images') {
    const newFiles = Array.from(files);

    // Combine old + new
    const totalFiles = [...formData.images, ...newFiles];

    // Filter unique files (by name and size to avoid duplicates)
    const uniqueFiles = totalFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    if (uniqueFiles.length > 6) {
      toast.warn('⚠️ Max 6 images allowed. Extra images ignored.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }

    setFormData({ ...formData, images: uniqueFiles.slice(0, 6) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('originalPrice', formData.originalPrice);
    data.append('category', formData.category);
    data.append('sizes', JSON.stringify(formData.sizes.split(',')));
    formData.images.forEach((img) => data.append('images', img));

    try {
      const response = await axios.post(
        'https://laksh-closet.onrender.com/api/products',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('✅ Product added successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        sizes: '',
        images: [],
      });

    } catch (error) {
      toast.error(error.response?.data?.message || '❌ Failed to add product!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="add-product-card">
        <h2 className="add-product-title">New Product</h2>
        <form onSubmit={handleSubmit} className="add-product-form">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="input-row">
            <div style={{ width: '100%' }}>
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ width: '100%' }}>
              <label>Original Price</label>
              <input
                type="number"
                name="originalPrice"
                placeholder="Original Price"
                value={formData.originalPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Images (max 6)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            required
          />
          {formData.images.length > 0 && (
            <>
              <div style={{ marginBottom: '0.5rem', color: '#9854f6', fontWeight: 500 }}>
                {formData.images.length} image{formData.images.length > 1 ? 's' : ''} selected
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {formData.images.map((img, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${index}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <button
                      onClick={() => {
                        const updated = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: updated });
                      }}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '2px 6px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        zIndex: 2,
                      }}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <label>Category</label>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <label>Sizes</label>
          <input
            type="text"
            name="sizes"
            placeholder="Sizes (comma separated: S,M,L,XL)"
            value={formData.sizes}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="add-product-btn"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
