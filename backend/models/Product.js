import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String }
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true, enum: ["26","28","30","32","34","36","38","40"] },
  stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  gallery: [{ type: String, required: true }],
  category: { type: String, required: true },
  reviews: [reviewSchema],
    sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, required: true, min: 0 },
    }
  ]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
