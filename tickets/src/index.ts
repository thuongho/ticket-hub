import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('No JWT variable');
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }

    await natsWrapper.connect('ticketing', 'joker', 'http://nats-srv:4222');

    // Shutting down gracefullly
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

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
