import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) console.error('SMTP connection failed:', error)
  else console.log('SMTP server ready')
})

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/api/auth/verify-email/${token}`
  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <h2>Welcome to DT89's WEBSITE</h2>
      <p>Click the link below to verify your email. It expires in 24 hours.</p>
      <a href="${url}">${url}</a>
    `,
  });
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/api/auth/reset-password/${token}`

  await sendMail({
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. It expires in 15 minutes.</p>
      <a href="${url}">${url}</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  })
}

export { sendMail, sendVerificationEmail, sendResetPasswordEmail };
