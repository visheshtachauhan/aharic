import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Check if email configuration exists
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  // In development mode, if email configuration is missing, log the email instead
  if (process.env.NODE_ENV === 'development' && (!host || !port || !user || !pass)) {
    console.log('Email would be sent in production:');
    console.log(`From: ${from || 'noreply@example.com'}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('HTML:', html);
    return { messageId: `dev-${Date.now()}` };
  }

  if (!host || !port || !user || !pass) {
    throw new Error('Missing email configuration. Please check your .env file.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // Only use secure for port 465
    auth: {
      user,
      pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: from || user,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // In development, don't fail the application for email errors
    if (process.env.NODE_ENV === 'development') {
      console.log('Email would have been sent in production:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      return { messageId: `dev-failed-${Date.now()}` };
    }
    
    throw error;
  }
} 