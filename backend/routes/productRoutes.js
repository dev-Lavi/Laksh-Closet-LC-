import express from 'express';
import multer from 'multer';
import {
  addProduct,
  updateProduct
} from '../controllers/productController.js';

import mongoose from 'mongoose';

import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer config (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get product by category
// @route   GET /api/products/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Requested ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err); // log actual error
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Add new product (Admin only)
// @route   POST /api/products
router.post('/', protect, adminOnly, upload.array('images', 6), addProduct);

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
router.put('/:id', protect, adminOnly, updateProduct);

export default router;
