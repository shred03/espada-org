import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

export const Image = mongoose.model('Image', imageSchema);