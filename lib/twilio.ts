import twilio from 'twilio';
import { createLogger } from './logger';

const logger = createLogger('twilio-service');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Missing Twilio configuration');
}

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });
    
    logger.info('SMS sent successfully', { 
      messageId: result.sid,
      to,
    });
    
    return result;
  } catch (error) {
    logger.error('Failed to send SMS', { 
      error,
      to,
    });
    throw error;
  }
}

export async function sendVerificationCode(to: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to, channel: 'sms' });
    
    logger.info('Verification code sent', { 
      verificationId: verification.sid,
      to,
    });
    
    return verification;
  } catch (error) {
    logger.error('Failed to send verification code', { 
      error,
      to,
    });
    throw error;
  }
}

export async function verifyCode(to: string, code: string) {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to, code });
    
    logger.info('Verification code checked', { 
      verificationId: verificationCheck.sid,
      to,
      status: verificationCheck.status,
    });
    
    return verificationCheck;
  } catch (error) {
    logger.error('Failed to verify code', { 
      error,
      to,
    });
    throw error;
  }
} 