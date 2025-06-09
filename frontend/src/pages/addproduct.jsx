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
    images: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: files[0] });
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
    data.append('images', formData.images);

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
        images: null,
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
          <label>Images</label>
          <input type="file" name="images" onChange={handleChange} required />
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
      {/* ✅ Toast Container here */}
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
