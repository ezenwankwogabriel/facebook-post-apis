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

describe('Facebook Posts', () => {
  let user, userAccessToken;

  beforeEach(async() => {
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

  describe('Publish a Post', () => {
    it('returns a post id on success', () => {
      const message = faker.lorem.sentence();

      return request(app)
        .post('/v1/post')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({message})
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).toHaveProperty('id')
        })
    })
  })

  describe('Fetch Posts', () => {
    it('returns a list of post on success', () => {
      return request(app)
        .get('/v1/post')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body[0]).toHaveProperty('id')
          expect(res.body[0]).toHaveProperty('message')
          expect(res.body[0]).toHaveProperty('created_time')
        })
    })
  })

  describe('Update/Comment on Post', () => {
    let pagePostId;

    beforeEach(async () => {
      const publishPostResponse = await request(app)
        .post('/v1/post')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ message: faker.lorem.sentence() })
        
      pagePostId = publishPostResponse.body.id;
    })

    describe('Edit a Post', () => {
      it('returns a boolean success', () => {
        let message = faker.lorem.sentence();

        return request(app)
          .put(`/v1/post/${pagePostId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({ message })
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.success).toEqual(true)
          })
      })
    })

    describe('Comment on Post', () => {
      it('returns a post id on success', () => {
        let message = faker.lorem.sentence();

        return request(app)
          .put(`/v1/post/${pagePostId}/comment`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({ message })
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).toHaveProperty('id')
          })
      })
    })
    
    describe('Delete Posts', () => {
      it('returns a boolean on success', () => {
  
        return request(app)
          .delete(`/v1/post/${pagePostId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send()
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.success).toEqual(true);
          })
      })
    })
  })
})