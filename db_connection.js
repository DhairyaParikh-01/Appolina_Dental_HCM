const mongoose = require('mongoose');
require('dotenv').config();

// Reusable cached connection for serverless environments (e.g. Vercel)
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connect_to_mongo = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error('Missing MONGODB_URL environment variable.');
    }

    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false, // disable mongoose buffering in lambdas
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      family: 4
    }).then((mongooseInstance) => {
      console.log('Connected to MongoDB successfully.');
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connect_to_mongo;
