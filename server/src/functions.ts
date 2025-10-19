import nodemailer from 'nodemailer';






export async function sendOtpEmail(to:string, otp:string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } as nodemailer.TransportOptions);

  await transporter.sendMail({
    from: "Verify your Email",
    to,
    subject: "Please use this One Time Password (OTP) to verify your mail id.",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes. Please don't share it to anyone, for your own safety and privacy.</p>`,
  });
}