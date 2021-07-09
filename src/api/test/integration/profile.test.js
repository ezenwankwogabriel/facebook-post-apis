const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');

const app = require('../../../config/express');
const { setupDB } = require('../../../config/test-setup');
const User = require('../../models/user.model');

// setup test db
const dbName = 'profile-test';
setupDB(dbName);

describe('Profile', () => {
  let user, userAccessToken;

  beforeEach(async () => {
    user = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    
    await User.deleteMany({});

    const registerUserResponse = await request(app)
      .post('/v1/auth/register')
      .send(user);
    userAccessToken = registerUserResponse.body.token.accessToken
  })

  describe('User Details', () => {
    it('should fetch user detail if jwt authenticated', () => {
      return request(app)
        .get('/v1/profile/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          const userData = res.body.user;
          expect(userData.email).toEqual(user.email.toLowerCase());
          expect(userData.name).toEqual(user.name);
        })
        
    })
    
    it('should report an error is not jwt authenticated', () => {
      return request(app)
        .get('/v1/profile/me')
        .expect(httpStatus.UNAUTHORIZED)
    })
  })
})