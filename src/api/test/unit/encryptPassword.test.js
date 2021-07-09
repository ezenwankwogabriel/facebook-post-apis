const bcrypt = require('bcryptjs');
const faker = require('faker');
const encryptPassword = require('../../utils/encryptPassword');

describe('Encrypts a password', () => {
  it('returns encrypted password', () => {
    const password = faker.internet.password();
    const encryptedPassword = encryptPassword(password);

    expect(encryptedPassword).toBeDefined();
  })
})