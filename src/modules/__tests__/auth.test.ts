// /* eslint-disable */
console.log('HEllo');
// const httpStatus = require('http-status');
// const request = require('supertest');
// const bcrypt = require('bcryptjs');
// const { redisClient } = require('../socket-handler');
// const { User, RefreshToken, Role, UserReferring } = require('../models');
// const app = require('../../index');
// const { createShortId } = require('../../lib/shortid');

// describe('Authentication API', () => {
//   let jonSnowAccessToken = null;
//   const password = '123123';
//   let passwordHashed;
//   let dbUser;
//   let user;
//   let user1;
//   let roles;
//   let refreshToken;
//   let referralCode = createShortId();

//   beforeAll(async () => {
//     passwordHashed = await bcrypt.hash(password, 1);
//     dbUser = {
//       email: 'branstark@gmail.com',
//       password: 'mypassword',
//       name: 'Bran Stark',
//     };
//     roles = [{ name: 'normalUser', description: 'normal user' }];

//     user = {
//       email: 'sousa.dfs@gmail.com',
//       password: '123456',
//       name: 'Daniel Sousa',
//     };

//     user1 = {
//       email: 'test_user@gmail.com',
//       password: '123456',
//       name: 'Test User',
//     };

//     refreshToken = {
//       token:
//         '5947397b323ae82d8c3a333b.c69d0435e62c9f4953af912442a3d064e20291f0d228c0552ed4be473e7d191ba40b18c2c47e8b9d',
//       userId: '5947397b323ae82d8c3a333b',
//       userEmail: dbUser.email,
//       expires: new Date(),
//     };

//     await Promise.all([
//       User.remove({}),
//       Role.remove({}),
//       RefreshToken.remove({}),
//     ]);

//     await Promise.all([
//       User.create(dbUser),
//       Role.insertMany(roles),
//     ]);
//   });

//   afterAll(async () => {
//     await new Promise((resolve) => {
//       redisClient.quit(() => {
//         resolve();
//       });
//     });
//     await new Promise(resolve => setImmediate(resolve));
//   });

//   describe('POST /v1/auth/register', () => {
//     test('should register a new user when request is ok', async () => {
//       const res = await request(app)
//         .post('/v1/auth/register')
//         .send(user);

//       const { status } = res;
//       expect(status).toBe(httpStatus.CREATED);
//     });

//     test('should create shortId when register is ok', async () => {
//       const res = await request(app)
//         .post('/v1/auth/register')
//         .send(user1);

//       const { status } = res;
//       expect(status).toBe(httpStatus.CREATED);
//       const createdUser = await User.findOne({ email: user1.email }).lean();
//       expect(typeof createdUser.referralCode).toBe('string');
//     });

//     test('should report error when email already exists', async () => {
//       const res = await request(app)
//         .post('/v1/auth/register')
//         .send(dbUser);
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.CONFLICT);
//       expect(body.message).toBe('Validation Error');
//       const error = body.errors[0];
//       expect(error).toHaveProperty('field');
//       expect(error.field).toBe('email');
//       expect(error.messages[0]).toBe('"email" already exists');
//     });

//     test('should report error when the email provided is not valid', async () => {
//       const res = await request(app)
//         .post('/v1/auth/register')
//         .send({
//           ...user,
//           email: 'this_is_not_an_email'
//         });
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.BAD_REQUEST);
//       const error = body.errors[0];
//       expect(error).toHaveProperty('field');
//       expect(error.field).toBe('email');
//       expect(error.messages[0]).toBe('"email" must be a valid email');
//     });

//     test('should report error when email and password are not provided', async () => {
//       const userData = { ...user };
//       delete userData.email;
//       const res = await request(app)
//         .post('/v1/auth/register')
//         .send(userData);
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.BAD_REQUEST);
//       const error = body.errors[0];
//       expect(error).toHaveProperty('field');
//       expect(error.field).toBe('email');
//       expect(error.messages[0]).toBe('"email" is required');
//     });
//   });

//   describe('POST /v1/auth/login', () => {
//     test('should return an accessToken and a refreshToken when email and password matches', async () => {
//       const res = await request(app)
//         .post('/v1/auth/login')
//         .send(dbUser);
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.OK);
//     });

//     test('should report error when email and password are not provided', async () => {
//       const res = await request(app)
//         .post('/v1/auth/login')
//         .send({});
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.BAD_REQUEST);
//       const error = body.errors[0];
//       expect(error).toHaveProperty('field');
//       expect(error.field).toBe('email');
//       expect(error.messages[0]).toBe('"email" is required');
//     });

//     test('should report error when the email provided is not valid', async () => {
//       const res = await request(app)
//         .post('/v1/auth/login')
//         .send({
//           ...user,
//           email: 'this_is_not_an_email',
//         });
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.BAD_REQUEST);
//       const error = body.errors[0];
//       expect(error).toHaveProperty('field');
//       expect(error.field).toBe('email');
//       expect(error.messages[0]).toBe('"email" must be a valid email');
//     });

//     test('should report error when email and password don\'t match', async () => {
//       dbUser.password = 'xxx';
//       const res = await request(app)
//         .post('/v1/auth/login')
//         .send(dbUser);
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.UNAUTHORIZED);
//       expect(body.message).toBe('Incorrect email or password');
//     });
//   });

//   describe('POST /v1/auth/refresh-token', () => {
//     test('should return a new accessToken when refreshToken and email match', async () => {
//       await RefreshToken.create(refreshToken);
//       const res = await request(app)
//         .post('/v1/auth/refresh-token')
//         .send({ email: dbUser.email, refreshToken: refreshToken.token });
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.OK);
//       expect(body).toHaveProperty('accessToken');
//       expect(body).toHaveProperty('accessToken');
//       expect(body).toHaveProperty('expiresIn');
//     });

//     test('should report error when email and refreshToken don\'t match', async () => {
//       await RefreshToken.create(refreshToken);
//       const  res = await request(app)
//         .post('/v1/auth/refresh-token')
//         .send({ email: user.email, refreshToken: refreshToken.token });
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.UNAUTHORIZED);
//       expect(body.message).toBe('Incorrect email or refreshToken');
//     });

//     test('should report error when email and refreshToken are not provided', async () => {
//       const res = await request(app)
//         .post('/v1/auth/refresh-token')
//         .send({});
//       const { body, status } = res;
//       expect(status).toBe(httpStatus.BAD_REQUEST);
//       const [error0, error1] = body.errors;
//       expect(error0.field).toBe('email');
//       expect(error0.messages[0]).toBe('"email" is required');
//       expect(error1.field).toBe('refreshToken');
//       expect(error1.messages[0]).toBe('"refreshToken" is required');
//     })
//   });
// });
