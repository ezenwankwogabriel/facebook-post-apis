const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');

const app = require('../../../config/express');
const { setupDB } = require('../../../config/test-setup');
const User = require('../../models/user.model');
const Email = require('../../utils/email');

//setup test db
const dbName = 'auth-test';
setupDB(dbName);

jest.mock('../../utils/email', () => jest.fn().mockImplementation(() => ({ send: () => {} })));

describe('Authentication', () => {
  let user, dbUser;

  beforeEach(async () => {
    dbUser = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }

    user = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    
    await User.deleteMany({});
    await User.create(user);
  })

  afterEach(async () => {
    
  })

  describe('POST /v1/auth/register', () => {
    it('should register a new user when request is ok and send the user an email', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(dbUser)
        .expect(httpStatus.CREATED)
        .then((res) => {
          const { token } = res.body;
          expect(token).toHaveProperty('accessToken');
          expect(token).toHaveProperty('expiresIn');
          expect(token).toHaveProperty('tokenType');
          expect(Email).toHaveBeenCalled();
        })
    })

    it('should report error when username already exists', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(user)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          const { field, location, messages } = res.body.errors[0];
          expect(field).toEqual('email');
          expect(location).toEqual('body');
          expect(messages).toEqual(expect.arrayContaining(['"email" already exists']));
        })
    })

    it('should report an error if email or password is not provided', () => {
      return request(app)
        .post('/v1/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { message } = res.body.errors.body[0];
          expect(message).toEqual('"name" is required');
        })
    })
  })

  describe('POST /v1/auth/login', () => {
    it('should login and return an accessToken when request is matches', () => {
      delete user.name;
      return request(app)
        .post('/v1/auth/login')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          const { token } = res.body;
          expect(token).toHaveProperty('accessToken');
          expect(token).toHaveProperty('expiresIn');
          expect(token).toHaveProperty('tokenType');
        })
    })

    it('should report error when email or password are not provided', () => {
      return request(app)
        .post('/v1/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { message } = res.body.errors.body[0];
          expect(message).toEqual('"email" is required');
        })
    })
    it('should report error when email and password do not match', () => {
      delete user.name;
      user.email = faker.internet.email();

      return request(app)
        .post('/v1/auth/login')
        .send(user)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          const { message } = res.body;
          expect(message).toEqual('Incorrect email or password');
        })
    })
  })

  describe('POST /v1/auth/request-password-request', () => {
    it('should return request password token if email matches', () => {
      return request(app)
        .post('/v1/auth/request-password-reset')
        .send({email: user.email})
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('userId');
        })
    })
    it('should return an error if email does not match', () => {
      return request(app)
        .post('/v1/auth/request-password-reset')
        .send({email: faker.internet.email()})
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).toEqual('Email does not exist');
        })
    })
    it('should return an error if email is not provided', () => {
      return request(app)
        .post('/v1/auth/request-password-reset')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { message } = res.body.errors.body[0];
          expect(message).toEqual('"email" is required');
        })
    })
  })

  describe('POST /v1/auth/reset-password', () => {
    let passwordRequestResponse, token, userId;

    beforeEach(async () => {
      passwordRequestResponse = await request(app)
        .post('/v1/auth/request-password-reset')
        .send({email: user.email});
      token = passwordRequestResponse.body.token;
      userId = passwordRequestResponse.body.userId;
    })

    it('should return a success and send an email if request matches', async () => {
      const res = await request(app)
        .post('/v1/auth/reset-password')
        .send({
          userId, token, password: faker.internet.password()
        })
      expect(res.status).toEqual(httpStatus.OK);
      expect(res.body.message).toEqual('Password reset successfully');
      expect(Email).toHaveBeenCalled();
    })

    it('should return an error if reset token is wrong', async () => {
      const res = await request(app)
        .post('/v1/auth/reset-password')
        .send({
          userId,
          token: faker.datatype.string(), 
          password: faker.internet.password()
        })
      expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      expect(res.body.message).toEqual('Invalid password reset token');
    })

    it('should return an error if userId, token or password is not provided', async () => {
      const res = await request(app)
        .post('/v1/auth/reset-password')
        .send({})
      expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      const { message } = res.body.errors.body[0];
      expect(message).toEqual('"userId" is required');
    })
  })
})