const nodemailer = require('nodemailer')

const USER_EMAIL = process.env.USER_EMAIL
const USER_PASS = process.env.USER_PASS

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
})

const sendMail = async (
  subject,
  body,
  button,
  targetEmail,
  targetName,
  url
) => {
  try {
    const link = process.env.CLIENT_URL + url

    const mailOptions = {
      from: '"KPU PPI Turki" <web.kpuppiturki@gmail.com>',
      to: targetEmail,
      subject,
      html: `<div>
      <h4>Hai ${targetName},</h4>
        <p>${body}</p>
        <a href="${link}">${button}</a>
        <p>Terima kasih!</p>
      </div>`,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent', result)
  } catch (error) {
    console.log('Nodemailer error', error)
  }
}

module.exports = sendMail
