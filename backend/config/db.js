const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined.');
  }

  cachedConnection = await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME,
  });

  return cachedConnection.connection;
};

module.exports = connectDB;
