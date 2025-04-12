import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/queue-flow';

    console.log('Connecting to MongoDB at:', mongoUri);

    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      autoIndex: true,
      family: 4, // 👈 Force IPv4 to avoid ::1 connection error
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('Successfully connected to MongoDB');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

if (!global.mongoose) {
  global.mongoose = cached;
}
