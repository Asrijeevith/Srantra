import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  queueSize: { type: Number, required: true, min: 1 },
  expiryDate: { type: Date, required: true },
  description: { type: String, required: true },
  qrCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

queueSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create or get the model
const Queue = mongoose.models.Queue || mongoose.model('Queue', queueSchema);

export default Queue;
