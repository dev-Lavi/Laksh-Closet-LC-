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

    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch {
      return res.status(400).json({ message: 'Invalid sizes format' });
    }

    try {
      parsedReviews = reviews ? JSON.parse(reviews) : [];
    } catch {
      return res.status(400).json({ message: 'Invalid reviews format' });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const uploadedImageUrls = await Promise.all(uploadPromises);

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
// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

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
