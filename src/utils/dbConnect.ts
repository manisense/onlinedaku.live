import mongoose from 'mongoose';
import '../models/Category';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Create a connection promise that we can reuse
let connectionPromise: Promise<typeof mongoose> | null = null;

async function dbConnect() {
  // If already connected, return immediately
  if (mongoose.connections[0].readyState) {
    return mongoose;
  }

  // If a connection is in progress, wait for it to complete
  if (connectionPromise) {
    return connectionPromise;
  }

  // Create a new connection
  try {
    connectionPromise = mongoose.connect(MONGODB_URI, { 
      bufferCommands: true, // Change to true to buffer commands until connected
    });
    
    // Wait for connection to complete
    const conn = await connectionPromise;
    console.log('Connected to MongoDB', mongoose.connection.name);
    return conn;
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect;