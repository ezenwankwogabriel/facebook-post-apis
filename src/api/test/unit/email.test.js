const faker = require('faker');

jest.mock('../../utils/email', () => jest.fn().mockImplementation(() => ({ send: () => ({success: true}) })));

const Email = require('../../utils/email');

describe('Sends email', () => {
  it('Sends an email', async () => {
    const response = await Email({
      name: faker.name.findName(),
      email: faker.internet.email(),
      template: 'reset-password',
      subject: 'Password Reset'
    }).send();

    expect(response.success).toEqual(true);
  })
})