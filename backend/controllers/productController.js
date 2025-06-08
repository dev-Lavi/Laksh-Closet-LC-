import Product from '../models/Product.js';

// @desc    Add new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      gallery,
      sizes,
      reviews,
      category
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      gallery,
      sizes,
      reviews,
      category
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add product', error: err.message });
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
    res.status(400).json({ message: 'Failed to update product', error: err.message });
  }
};
