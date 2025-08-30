import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLayout from '../components/AdminLayout';

const YourProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products/list/admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setProducts(products.filter(product => product._id !== productId));
          alert('Product deleted successfully!');
        } else {
          alert('Failed to delete product');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error deleting product');
      }
    }
  };

  const handleUpdate = (productId) => {
    window.location.href = `/admin/update-product/${productId}`;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Skeleton Loading Component
  const ProductSkeleton = () => (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="skeleton-image"></div>
        <div className="card-body">
          <div className="skeleton skeleton-title mb-3"></div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="skeleton skeleton-price"></div>
            <div className="skeleton skeleton-category"></div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="skeleton skeleton-date"></div>
            <div className="skeleton skeleton-id"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container-fluid py-4">
        {/* Header Skeleton */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-8">
                <div className="skeleton skeleton-search"></div>
              </div>
              <div className="col-md-4">
                <div className="skeleton skeleton-filter"></div>
              </div>
            </div>
            <div className="skeleton skeleton-count"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="row">
          {[...Array(6)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>

        <style jsx>{`
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 6px;
          }
          
          .skeleton-image {
            width: 100%;
            height: 250px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 6px 6px 0 0;
          }
          
          .skeleton-title { height: 24px; width: 80%; }
          .skeleton-price { height: 20px; width: 60px; }
          .skeleton-category { height: 20px; width: 80px; }
          .skeleton-date { height: 16px; width: 120px; }
          .skeleton-id { height: 16px; width: 80px; }
          .skeleton-search { height: 45px; width: 100%; }
          .skeleton-filter { height: 45px; width: 100%; }
          .skeleton-count { height: 20px; width: 150px; }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-5">
                <div className="text-danger mb-3">
                  <i className="fas fa-exclamation-triangle fa-3x"></i>
                </div>
                <h3 className="text-dark mb-3">Error loading products</h3>
                <p className="text-muted mb-4">{error}</p>
                <button 
                  onClick={fetchProducts} 
                  className="btn btn-custom-primary px-4 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #984EFF 0%, #5E3FDE 100%)',
                    border: 'none',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Dashboard">
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          {/* Search and Filter Section */}
          <div className="row mb-3">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderColor: '#e9ecef' }}>
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search products by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    borderColor: '#e9ecef',
                    boxShadow: 'none',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select"
                style={{ 
                  borderColor: '#e9ecef',
                  boxShadow: 'none',
                  fontSize: '16px'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted fw-medium">{filteredProducts.length} products found</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-5">
                <div className="text-muted mb-3">
                  <i className="fas fa-box-open fa-3x"></i>
                </div>
                <h3 className="text-dark mb-3">No products found</h3>
                <p className="text-muted">Try adjusting your search criteria or add your first product.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative overflow-hidden">
                  <img
                    src={product.gallery && product.gallery.length > 0 ? product.gallery[0] : '/placeholder-image.jpg'}
                    alt={product.name}
                    className="card-img-top product-image"
                    style={{ 
                      height: '250px', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <div className="d-flex gap-3">
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="btn btn-success rounded-circle p-3 shadow"
                        title="Update Product"
                        style={{ 
                          width: '50px', 
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-danger rounded-circle p-3 shadow"
                        title="Delete Product"
                        style={{ 
                          width: '50px', 
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <h5 className="card-title text-dark fw-bold mb-3" title={product.name}>
                    {product.name}
                  </h5>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-5 fw-bold" style={{ color: '#984EFF' }}>
                      {formatPrice(product.price)}
                    </span>
                    <span 
                      className="badge rounded-pill px-3 py-2"
                      style={{ 
                        backgroundColor: '#5E3FDE',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    >
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Created: {formatDate(product.createdAt)}
                    </small>
                    <small className="text-muted">
                      ID: {product._id.slice(-8)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      )}

      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
          border-radius: 12px !important;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(152, 78, 255, 0.2) !important;
        }
        
        .product-image {
          transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .product-overlay {
          background: rgba(0, 0, 0, 0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover .product-overlay {
          opacity: 1;
        }
        
        .card-img-top {
          border-radius: 12px 12px 0 0 !important;
          width: 100% !important;
          height: 300px !important; /* Increase this height */
          object-fit: contain !important; /* Change to 'fill' */
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #984EFF !important;
          box-shadow: 0 0 0 0.2rem rgba(152, 78, 255, 0.25) !important;
        }
        
        .input-group-text:has(+ .form-control:focus) {
          border-color: #984EFF !important;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
          border: none !important;
          transition: all 0.3s ease;
        }
        
        .btn-success:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #20c997 0%, #28a745 100%) !important;
        }
        
        .btn-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
          border: none !important;
          transition: all 0.3s ease;
        }
        
        .btn-danger:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #c82333 0%, #dc3545 100%) !important;
        }
      `}</style>
    </div>
    </AdminLayout>
  );
};

export default YourProducts;
