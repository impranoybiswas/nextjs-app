import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};


export async function sendMail({ to, subject, html }: SendMailOptions) {
  if (!to) throw new Error("Recipient email (to) is required");

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { success: true };
}
