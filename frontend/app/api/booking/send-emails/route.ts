import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface BookingEmailRequest {
  renterEmail: string;
  ownerEmail: string;
  bookingDetails: {
    itemTitle: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    paymentId: string;
    orderId: string;
    renterName: string;
    notes?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingEmailRequest = await request.json();
    const { renterEmail, ownerEmail, bookingDetails } = body;

    // Create nodemailer transporter with better error handling
    const emailUser = process.env.EMAIL_USER || 'rentcart.service@gmail.com';
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailPass) {
      console.warn('EMAIL_PASS environment variable not set. Skipping email sending.');
      return NextResponse.json({ 
        success: true, 
        message: 'Email configuration not set up. Order confirmation will be sent by backend.' 
      });
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Format dates for display
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Calculate rental days
    const startDate = new Date(bookingDetails.startDate);
    const endDate = new Date(bookingDetails.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Email template for the renter (customer)
    const renterEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">🎉 Booking Confirmed!</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">Your rental booking has been successfully confirmed</p>
          </div>
          
          <div style="background-color: #EFF6FF; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1E40AF; margin: 0 0 15px 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td style="padding: 8px 0;">${bookingDetails.orderId}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Item:</td><td style="padding: 8px 0;">${bookingDetails.itemTitle}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Amount Paid:</td><td style="padding: 8px 0; color: #059669;">₹${bookingDetails.totalAmount}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Start Date:</td><td style="padding: 8px 0;">${formatDate(bookingDetails.startDate)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">End Date:</td><td style="padding: 8px 0;">${formatDate(bookingDetails.endDate)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Renter:</td><td style="padding: 8px 0;">${bookingDetails.renterName}</td></tr>
            </table>
          </div>
          
          <div style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #059669; margin: 0 0 10px 0;">📋 Next Steps</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li>The item owner will contact you shortly for delivery arrangements</li>
              <li>Make sure you're available at the delivery address on the start date</li>
              <li>After receiving the item, you can leave a review on our platform</li>
              <li>Return the item in good condition by the end date</li>
            </ul>
          </div>
          
          <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400E;"><strong>📞 Contact Info:</strong></p>
            <p style="margin: 5px 0 0 0; color: #92400E;">Item Owner: ${ownerEmail}</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0;">Thank you for choosing RentCart!</p>
            <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">For support, contact us at support@rentcart.com</p>
          </div>
        </div>
      </div>
    `;

    // Email template for the owner
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">💰 New Booking Received!</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">Someone has booked your item</p>
          </div>
          
          <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #065F46; margin: 0 0 15px 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td style="padding: 8px 0;">${bookingDetails.orderId}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Your Item:</td><td style="padding: 8px 0;">${bookingDetails.itemTitle}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Earning:</td><td style="padding: 8px 0; color: #059669; font-weight: bold;">₹${bookingDetails.totalAmount}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Start Date:</td><td style="padding: 8px 0;">${formatDate(bookingDetails.startDate)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">End Date:</td><td style="padding: 8px 0;">${formatDate(bookingDetails.endDate)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Customer:</td><td style="padding: 8px 0;">${bookingDetails.renterName}</td></tr>
            </table>
          </div>
          
          <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #92400E; margin: 0 0 10px 0;">👤 Customer Details</h3>
            <p style="margin: 0; color: #92400E;"><strong>Email:</strong> ${renterEmail}</p>
            <p style="margin: 5px 0 0 0; color: #92400E;"><strong>Name:</strong> ${bookingDetails.renterName}</p>
          </div>
          
          <div style="background-color: #EFF6FF; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1E40AF; margin: 0 0 10px 0;">📋 Your Action Items</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li>Contact the customer to arrange delivery: ${renterEmail}</li>
              <li>Prepare the item for delivery by ${formatDate(bookingDetails.startDate)}</li>
              <li>Ensure the item is in good working condition</li>
              <li>Collect the item back by ${formatDate(bookingDetails.endDate)}</li>
              <li>Your item is now marked as "BOOKED" and won't be visible to other users</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0;">Congratulations on your booking!</p>
            <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">For support, contact us at support@rentcart.com</p>
          </div>
        </div>
      </div>
    `;

    // Send email to the renter
    try {
      await transporter.sendMail({
        from: `"RentCart" <${emailUser}>`,
        to: renterEmail,
        subject: `🎉 Booking Confirmed - ${bookingDetails.itemTitle} (${bookingDetails.orderId})`,
        html: renterEmailHtml,
      });
      console.log('Renter email sent successfully to:', renterEmail);
    } catch (error) {
      console.error('Failed to send email to renter:', error);
      // Continue with owner email even if renter email fails
    }

    // Send email to the owner
    try {
      await transporter.sendMail({
        from: `"RentCart" <${emailUser}>`,
        to: ownerEmail,
        subject: `💰 New Booking Received - ${bookingDetails.itemTitle} (${bookingDetails.orderId})`,
        html: ownerEmailHtml,
      });
      console.log('Owner email sent successfully to:', ownerEmail);
    } catch (error) {
      console.error('Failed to send email to owner:', error);
      // Don't fail the entire request if one email fails
    }

    console.log('Booking emails sent successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Booking notification emails sent successfully. Order confirmation with PDF will be sent by the backend.' 
    });

  } catch (error) {
    console.error('Error sending booking emails:', error);
    return NextResponse.json(
      { error: 'Failed to send booking emails' },
      { status: 500 }
    );
  }
}
