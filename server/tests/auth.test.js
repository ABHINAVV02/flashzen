import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

beforeAll(async () => {
  // Connect to test DB (create a separate test database in MongoDB)
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flashzen-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPassword123'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register with an existing email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser2',
      email: 'testuser@example.com',
      password: 'AnotherPass123'
    });
    expect(res.statusCode).toEqual(400);
  });
});
