
import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/next', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDb;
