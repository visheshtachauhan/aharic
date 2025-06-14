import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is a super admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    const db = await connectToDatabase();

    // Get the current request to check for status change
    const currentRequest = await db.collection('support_requests').findOne(
      { _id: new ObjectId(params.id) }
    );

    if (!currentRequest) {
      return NextResponse.json(
        { success: false, message: 'Support request not found' },
        { status: 404 }
      );
    }

    // Update the support request
    const result = await db.collection('support_requests').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: session.user.id
        }
      }
    );

    // Send email notification if status changed
    if (updates.status && updates.status !== currentRequest.status) {
      try {
        // Email to customer
        await sendEmail({
          to: currentRequest.email,
          subject: `Support Request Update: ${currentRequest.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #FF7300; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                .content { padding: 20px; background: #f9f9f9; border-radius: 5px; margin: 20px 0; }
                .status { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
                .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Support Request Update</h2>
                </div>
                <div class="content">
                  <p>Hello ${currentRequest.name},</p>
                  <p>Your support request has been updated:</p>
                  
                  <p><strong>Request:</strong> ${currentRequest.subject}</p>
                  <p><strong>New Status:</strong> <span class="status" style="background: ${
                    updates.status === 'resolved' ? '#4CAF50' :
                    updates.status === 'in_progress' ? '#2196F3' :
                    updates.status === 'pending' ? '#FFC107' : '#9C27B0'
                  }; color: white;">${updates.status.replace('_', ' ').toUpperCase()}</span></p>
                  
                  ${updates.response ? `
                    <div style="margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #FF7300;">
                      <p><strong>Response from our team:</strong></p>
                      <p style="white-space: pre-wrap;">${updates.response}</p>
                    </div>
                  ` : ''}
                  
                  <p style="margin-top: 20px;">If you have any questions, please don't hesitate to reply to this email.</p>
                </div>
                <div class="footer">
                  <p>Request ID: ${currentRequest._id}</p>
                  <p>The Tasty Corner Support Team</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        // Email to support team
        await sendEmail({
          to: process.env.SUPPORT_EMAIL || 'support@thetastycorner.com',
          subject: `Support Request ${currentRequest._id} Updated`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #FF7300; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                .content { padding: 20px; background: #f9f9f9; border-radius: 5px; margin: 20px 0; }
                .status { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
                .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 10px; margin: 15px 0; }
                .label { font-weight: bold; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Support Request Updated</h2>
                </div>
                <div class="content">
                  <div class="info-grid">
                    <div class="label">Request ID:</div>
                    <div>${currentRequest._id}</div>
                    
                    <div class="label">Customer:</div>
                    <div>${currentRequest.name} (${currentRequest.email})</div>
                    
                    <div class="label">Subject:</div>
                    <div>${currentRequest.subject}</div>
                    
                    <div class="label">Previous Status:</div>
                    <div><span class="status" style="background: #666; color: white;">
                      ${currentRequest.status.toUpperCase()}
                    </span></div>
                    
                    <div class="label">New Status:</div>
                    <div><span class="status" style="background: ${
                      updates.status === 'resolved' ? '#4CAF50' :
                      updates.status === 'in_progress' ? '#2196F3' :
                      updates.status === 'pending' ? '#FFC107' : '#9C27B0'
                    }; color: white;">
                      ${updates.status.toUpperCase()}
                    </span></div>
                    
                    <div class="label">Updated By:</div>
                    <div>${session.user.name || session.user.email}</div>
                  </div>

                  ${updates.response ? `
                    <div style="margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #FF7300;">
                      <p><strong>Response sent to customer:</strong></p>
                      <p style="white-space: pre-wrap;">${updates.response}</p>
                    </div>
                  ` : ''}
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Support request updated successfully'
    });
  } catch (error) {
    console.error('Error updating support request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update support request' 
      },
      { status: 500 }
    );
  }
} 