import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// TS has a type definition for what global is and signin is not part of it
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
  process.env.JWT_KEY = 'asdfda';

  // before all tests, create mongodb memory server
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  // connect to in memory mongo server
  await mongoose.connect(mongoUri, {
    // mongo rewrote url parser that is a big change, so it sets it as a flag
    useNewUrlParser: true,
    // monitoring all the servers in a replica set or shared cluster
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  // look for all the connections in mongoose and delete those connections
  const collections = await mongoose.connection.db.collections();

  // reset data before each test we run
  for (let collection of collections) {
    // method in mongoose to delete documents from a collection
    // pass a query that contains the conditions and the documents gets deleted
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a jWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into a JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string thats the cookie with the encoded data
  const cookie = `express:sess=${base64}`;
  return [cookie];
};
