import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export async function sendPasswordResetEmail(email: string, otp: string) {
  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log('SMTP connection verified');

    const mailOptions = {
      from: `"TOPCLOSER" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset OTP - TOPCLOSER',
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #000000;">
                        <span style="color: #000000;">TOP</span><span style="color: #ef4444;">CLOSER</span>
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1f2937;">Password Reset Request</h2>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        We received a request to reset your password. Use the OTP code below to complete the process:
                      </p>
                      
                      <!-- OTP Box -->
                      <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Your OTP Code</p>
                        <p style="margin: 0; font-size: 36px; font-weight: bold; color: #ef4444; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </div>
                      
                      <p style="margin: 20px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                        This code will expire in <strong>15 minutes</strong>. If you didn't request this password reset, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                        This is an automated email. Please do not reply to this message.
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                        © ${new Date().getFullYear()} TOPCLOSER. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
      text: `
Password Reset Request

Your OTP code is: ${otp}

This code will expire in 15 minutes. If you didn't request this password reset, please ignore this email.

© ${new Date().getFullYear()} TOPCLOSER. All rights reserved.
    `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
