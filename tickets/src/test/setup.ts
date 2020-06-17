import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock('../nats-wrapper.ts');

let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks();

  process.env.JWT_KEY = 'asdfadas';
  // before all test, create mongodb memory server
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  // connect to in memory mongo server
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  // look for all the connections in mongoose and delete those connections
  const collections = await mongoose.connection.db.collections();

  // reset data before each test we run
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into a JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  const cookie = `express:sess=${base64}`;
  return [cookie];
};
