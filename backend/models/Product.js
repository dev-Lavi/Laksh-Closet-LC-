import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  label: String,
  available: Boolean
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  originalPrice: Number,
  gallery: [String],
  category: String,
  reviews: [reviewSchema],
  sizes: [sizeSchema]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
