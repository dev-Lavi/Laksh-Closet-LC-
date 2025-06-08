import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add new product — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add product', error: err.message });
  }
});

// Update product — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product' });
  }
});
