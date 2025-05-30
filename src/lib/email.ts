// // // lib/email.ts
// // import { Resend } from 'resend';
// // const resend = new Resend(process.env.RESEND_API_KEY);

// // export async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
// //   await resend.emails.send({
// //     from: 'your@domain.com',
// //     to,
// //     subject,
// //     text
// //   });
// // }


// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY); // ✅ Uses .env variable

// export async function sendEmail({
//   to,
//   subject,
//   text
// }: {
//   to: string;
//   subject: string;
//   text: string;
// }) {
//   await resend.emails.send({
//     from: 'deepakvarshney.com@gmail.com', // Must be a verified sender
//     to,
//     subject,
//     text
//   });
// }


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await transporter.sendMail({
    from: `"Event App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
