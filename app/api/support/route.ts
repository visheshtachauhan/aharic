import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// Validation schema for support request
const supportRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

// In-memory storage for support requests when MongoDB is unavailable
const memoryStorage: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input using Zod schema
    const validationResult = supportRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;
    let requestId = '';

    try {
      // Try to connect to MongoDB
      const db = await connectToDatabase();
      
      // Save support request to database
      const result = await db.collection('support_requests').insertOne({
        name,
        email,
        phone,
        subject,
        message,
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        restaurantId: request.headers.get('x-restaurant-id') || 'platform',
        source: request.headers.get('x-restaurant-id') ? 'restaurant' : 'platform',
        assignedTo: null,
        notes: [],
        priority: 'normal'
      });
      
      requestId = result.insertedId?.toString() || `memory-${Date.now()}`;

      // Try to send email notification
      try {
        console.log('Attempting to send email notification to:', process.env.SUPPORT_EMAIL);
        await sendEmail({
          to: process.env.SUPPORT_EMAIL || 'support@thetastycorner.com',
          subject: `New Support Request: ${subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #FF7300; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                .content { padding: 20px; background: #f9f9f9; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>New Support Request</h2>
                </div>
                <div class="content">
                  <p><strong>Request ID:</strong> ${requestId}</p>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong></p>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <div class="footer">
                  <p>Submitted on: ${new Date().toLocaleString()}</p>
                  <p>The Tasty Corner Support Team</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Support request submitted successfully. Our team will contact you soon.',
        requestId
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save support request. Please try again later.');
    }
  } catch (error: any) {
    console.error('Support request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
} 