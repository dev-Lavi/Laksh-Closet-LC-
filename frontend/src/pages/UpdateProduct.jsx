import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './updateproduct.css';
import AdminLayout from '../components/AdminLayout';

const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  
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
  });

  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const product = response.data;
        
        // Populate form with existing data
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          category: product.category || '',
          sizes: product.sizes?.length > 0 
            ? product.sizes.reduce((acc, sizeObj) => ({
                ...acc,
                [sizeObj.size]: sizeObj.stock
              }), initialSizes)
            : initialSizes,
        });

        setExistingImages(product.gallery || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product data');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare sizes array (only include sizes with stock > 0)
      const sizeStockArray = Object.entries(formData.sizes)
        .filter(([_, stock]) => stock !== '' && !isNaN(stock) && parseInt(stock) > 0)
        .map(([size, stock]) => ({
          size,
          stock: parseInt(stock, 10),
        }));

      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        sizes: sizeStockArray,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      const response = await axios.put(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Product updated successfully!');
      console.log('Updated product:', response.data);
      
      // Navigate back to products list or product detail page
      navigate('/admin/products'); // Adjust route as needed
      
    } catch (error) {
      console.error('Update error:', error);
      console.error('Server response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Product update failed';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="update-product-loading">
        <p>Loading product data...</p>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="update-product-error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Dashboard">
    <div className="update-product-card">
      <form onSubmit={handleSubmit} className="update-product-form">
        <div className="update-product-header">
          <h2 className="update-product-title">Update Product</h2>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
          rows="4"
        />

        <div className="price-row">
          <div>
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label>Original Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />

        <label>Sizes and Stock</label>
        <div className="update-product-sizes-grid">
          {Object.keys(formData.sizes).map((size) => (
            <div key={size} className="size-input-group">
              <label>Size {size}:</label>
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

        {/* Display existing images */}
        {existingImages.length > 0 && (
          <div className="existing-images-section">
            <label>Current Images</label>
            <div className="existing-images-grid">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="existing-image-item">
                  <img 
                    src={imageUrl} 
                    alt={`Product ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <p className="image-note">
              <strong>Note:</strong> Image updates are not supported in this form. 
              Contact admin for image changes.
            </p>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="cancel-button"
            disabled={updating}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="update-product-btn"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
};

export default UpdateProduct;
