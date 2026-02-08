import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  type: 'powder' | 'liquid';
  price: number;
  description: string;
  fullDescription: string;
  composition: string[];
  benefits: string[];
  usage: string;
  image: string;
}

const productSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['powder', 'liquid'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  composition: [{ type: String }],
  benefits: [{ type: String }],
  usage: { type: String, required: true },
  image: { type: String, required: true }
});

export default mongoose.model<IProduct>('Product', productSchema);
