const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const hbs = require('nodemailer-express-handlebars');

//Klasa za slanje mailova, s fjama koje definiraju tipove maillova
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstname;
    this.url = url;
    this.from = `Recipely <${process.env.EMAIL_FROM}>`;
    if (user.message) {
      console.log('Ima poruka');
      this.message = user.message;
      this.tel = user.tel;
      this.mail = user.email2;
    }
  }

  newTransport() {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendWelcome() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Welcome',
      html:
        '<p>Hvala Vam, ' +
        this.firstName +
        ', što ste postali korisnik naše cooking aplikacije. Sa nama je kuhanje lakse nego ikad! Hvala Vam na ukazanom povjerenju!</p>'
    };

    await this.newTransport().sendMail(mailOptions);
  }
  async sendGoodBy() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Good Bye',
      html: '<p>Vaš nalog je obrisan. Dodjite nam ponovo!</p>'
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendFormMail() {
    const mailOptions = {
      from: this.from,
      to: this.from,
      subject: 'UPIT',
      html:
        '<p>Pošiljaoc: ' +
        this.firstName +
        '</p><br> <p>Message: ' +
        this.message +
        '</p><br> <p>Email: ' +
        this.mail +
        '</p><br> <p>Tel: ' +
        this.tel +
        '</p><br>'
    };

    await this.newTransport().sendMail(mailOptions);
  }
  async sendPasswordReset() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Pasword Reset',
      html:
        '<p>Zaboravili ste sifru? Unesite je na sljedecem linku:' +
        this.url +
        '.\n</p>'
    };

    await this.newTransport().sendMail(mailOptions);
  }
};
