import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      authCookie(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
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

global.authCookie = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
