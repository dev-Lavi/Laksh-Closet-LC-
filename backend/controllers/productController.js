import dotenv from 'dotenv'; 
import Product from '../models/Product.js';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      sizes,
      reviews,
      category
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    let parsedSizes = [];
    let parsedReviews = [];

    // Parse and validate sizes
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
      const validSizes = ["26", "28", "30", "32", "34", "36", "38", "40"];

      const invalid = parsedSizes.some(s =>
        !validSizes.includes(String(s.size)) || typeof s.stock !== "number"
      );

      if (invalid) {
        return res.status(400).json({
          message: 'Sizes must be one of [26, 28, 30, 32, 34, 36, 38, 40] with numeric stock values'
        });
      }
    } catch {
      return res.status(400).json({ message: 'Invalid sizes format' });
    }

    // Parse reviews if provided
    try {
      parsedReviews = reviews ? JSON.parse(reviews) : [];
    } catch {
      return res.status(400).json({ message: 'Invalid reviews format' });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const uploadedImageUrls = await Promise.all(uploadPromises);

    // Create product
    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      gallery: uploadedImageUrls,
      sizes: parsedSizes,
      reviews: parsedReviews,
      category
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({
      message: 'Failed to add product',
      error: err.message
    });
  }
};

// @desc    Get all products (Admin only)
// @route   GET /api/products/admin
// @access  Private/Admin
export const getAllProductsForAdmin = async (req, res) => {
  try {
    // Fetch products but only return first image from gallery
    const products = await Product.find({}, {
      name: 1,
      price: 1,
      category: 1,
      createdAt: 1,
      gallery: { $slice: 1 }  // return only the first image
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch products',
      error: err.message
    });
  }
};


// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    // Check for missing request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: 'Invalid request body. Please send JSON data.' 
      });
    }

    // Remove gallery from updateData if present
    const { gallery, ...updateData } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({
      message: 'Failed to update product',
      error: err.message
    });
  }
};



// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete product',
      error: err.message
    });
  }
};
