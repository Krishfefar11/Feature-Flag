const { Resend } = require("resend");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Lazily initialized — only created when actually sending an email
let resend = null;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not set. Add it to your backend/utils/.env file. " +
        "Get your key from https://resend.com/api-keys"
      );
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Send a password reset email using Resend
 * @param {string} toEmail - Recipient email address
 * @param {string} token - The reset token
 */
async function sendResetEmail(toEmail, token) {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  const { data, error } = await getResendClient().emails.send({
    from: "onboarding@resend.dev",
    to: [toEmail],
    subject: "Reset Your Password — Feature Flag Console",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px 32px; color: #e2e8f0;">
        <h1 style="color: #818cf8; font-size: 24px; margin-bottom: 8px;">🚩 Feature Flag Console</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Password Reset Request</p>
        
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to set a new one. This link expires in <strong style="color: #f59e0b;">15 minutes</strong>.
        </p>
        
        <a href="${resetLink}" 
           style="display: inline-block; background: #6366f1; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
          Reset Password
        </a>
        
        <p style="font-size: 13px; color: #64748b; margin-top: 32px; line-height: 1.5;">
          If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
        </p>
        
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 32px 0 16px;" />
        <p style="font-size: 12px; color: #475569;">Feature Flag Console &bull; Secure password reset</p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Resend email error:", error);
    throw new Error("Failed to send reset email");
  }

  console.log("✅ Reset email sent:", data?.id);
  return data;
}

/**
 * Send a verification email using Resend
 * @param {string} toEmail - Recipient email address
 * @param {string} token - The verification token
 */
async function sendVerificationEmail(toEmail, token) {
  const verifyLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const { data, error } = await getResendClient().emails.send({
    from: "onboarding@resend.dev",
    to: [toEmail],
    subject: "Verify Your Email — Feature Flag Console",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px 32px; color: #e2e8f0;">
        <h1 style="color: #10b981; font-size: 24px; margin-bottom: 8px;">🚩 Feature Flag Console</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Email Verification Needed</p>
        
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for signing up! Please verify your email address to activate your account. This link expires in <strong style="color: #f59e0b;">24 hours</strong>.
        </p>
        
        <a href="${verifyLink}" 
           style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
          Verify Email
        </a>
        
        <p style="font-size: 13px; color: #64748b; margin-top: 32px; line-height: 1.5;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 32px 0 16px;" />
        <p style="font-size: 12px; color: #475569;">Feature Flag Console &bull; Account security</p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Resend verification email error:", error);
    throw new Error("Failed to send verification email");
  }

  console.log("✅ Verification email sent:", data?.id);
  return data;
}

module.exports = { sendResetEmail, sendVerificationEmail };
