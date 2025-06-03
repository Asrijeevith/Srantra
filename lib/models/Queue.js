import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Queue name is required'],
    trim: true
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  queueSize: {
    type: Number,
    required: [true, 'Queue size is required'],
    min: [1, 'Queue size must be at least 1']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  participants: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['waiting', 'current', 'skipped', 'served'],
      default: 'waiting'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: {
      type: Date
    },
    skippedAt: {
      type: Date
    },
    servedAt: {
      type: Date
    },
    estimatedWaitTime: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Create indexes for better query performance
QueueSchema.index({ userId: 1 });
QueueSchema.index({ 'participants.phone': 1 });

export default mongoose.models.Queue || mongoose.model('Queue', QueueSchema);
