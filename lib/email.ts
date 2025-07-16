import nodemailer from 'nodemailer';
import { createLogger } from './logger';

const logger = createLogger('email-service');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    logger.info('Email sent successfully', { messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send email', { error });
    throw new Error('Failed to send email');
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
  const subject = 'Reset Your Password';
  const html = `
    <h1>Password Reset Request</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  try {
    await sendEmail(to, subject, html);
    logger.info('Password reset email sent', { to });
  } catch (error) {
    logger.error('Failed to send password reset email', { error, to });
    throw new Error('Failed to send password reset email');
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const subject = 'Welcome to Our Platform';
  const html = `
    <h1>Welcome, ${name}!</h1>
    <p>Thank you for joining our platform. We're excited to have you on board!</p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
  `;

  try {
    await sendEmail(to, subject, html);
    logger.info('Welcome email sent', { to });
  } catch (error) {
    logger.error('Failed to send welcome email', { error, to });
    throw new Error('Failed to send welcome email');
  }
} 