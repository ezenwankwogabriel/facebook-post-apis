const ejs = require('ejs');
const SGmail = require('@sendgrid/mail');
const RootDir = require('../../../rootDir');
const logger = require('../../config/logger');
const { SGKey, emailSender } = require('../../config/vars');

SGmail.setApiKey(SGKey);

class Email {
  constructor({subject, email, template, name, link}) {
    this.email = email;
    this.subject = subject;
    this.template = template;
    this.name = name;
    this.link = link;
  }

  async getContent() {
    const emailTemplate = await ejs.renderFile(`${RootDir}/src/api/views/${this.template}.ejs`, {
      name: this.name,
      link: this.link,
    });
    return emailTemplate;
  }

  async sendMail(content) {
    /* using sendgrid */
    const message = {
      to: this.email,
      from: { email: emailSender, name: 'FACEBOOK APP' },
      subject: this.subject,
      html: content
    };

    try {
      return await SGmail.send(message);
    } catch (ex) {
      throw new Error(ex);
    }
  }

  async send() {
    try {
      const template = await this.getContent();
      return await this.sendMail(template);
    } catch (ex) {
      let message = ex.message || 'Error sending email';
      logger.error(message);
      throw ex;
    }
  }
}

module.exports = data => new Email(data);
