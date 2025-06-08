import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  availableSizes: [String],
  images: [String],
  description: { type: String },
  category: { type: String } // e.g. "baggy", "straight-fit", "new-arrival"
});

const Product = mongoose.model('Product', productSchema);
export default Product;
