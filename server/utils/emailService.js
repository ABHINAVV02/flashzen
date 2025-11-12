import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    // For development, you can use services like Gmail, Outlook, etc.
    // For production, use services like SendGrid, Mailgun, etc.
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your email password or app password
    }
  });
};

export const sendDeleteConfirmationEmail = async (email, token) => {
  const transporter = createTransporter();

  const deleteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/confirm-delete/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirm Account Deletion - FlashZen',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Account Deletion Confirmation</h2>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin-bottom: 20px;">
            We received a request to delete your FlashZen account. This action cannot be undone and will permanently remove:
          </p>

          <ul style="color: #666; margin-bottom: 20px;">
            <li>All your flashcard decks and cards</li>
            <li>Your revision statistics and progress</li>
            <li>Your profile information and settings</li>
            <li>All activity logs and achievements</li>
          </ul>

          <p style="color: #d32f2f; font-weight: bold; margin-bottom: 20px;">
            ⚠️ This action is irreversible. Please confirm only if you're absolutely sure.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${deleteUrl}"
               style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Yes, Delete My Account
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you didn't request this deletion, please ignore this email. The link will expire in 24 hours.
          </p>

          <p style="color: #666; font-size: 14px;">
            For security reasons, this link can only be used once and will expire after 24 hours.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            FlashZen - Smart Flashcard Learning<br>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Delete confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending delete confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

export const generateDeleteToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
