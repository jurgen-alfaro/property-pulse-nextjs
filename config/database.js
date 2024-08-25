import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true); // Ensures only fields specified in the schema will be saved to the db

  // If db is already connected, don't connect again
  if (connected) {
    console.log('MongoDB is connected');
    return;
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
