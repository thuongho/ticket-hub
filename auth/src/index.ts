import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('starting up...');

  if (!process.env.JWT_KEY) {
    throw new Error('No JWT variable');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined.');
  }

  try {
    // normally it is mongodb://localhost/table_name
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!!!');
});

start();
