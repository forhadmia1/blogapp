export const getVerificationEmailTemplate = (url: string, userName: string = 'User') => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #555; font-size: 16px;">Hi ${userName},</p>
        <p style="color: #555; font-size: 16px;">
            Thank you for registering! Please click the button below to verify your email address and activate your account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; font-weight: bold;">
                Verify Email
            </a>
        </div>
        <p style="color: #555; font-size: 16px;">
            If the button doesn't work, you can also copy and paste the following link into your browser:
        </p>
        <p style="word-break: break-all; font-size: 14px;">
            <a href="${url}" style="color: #007bff;">${url}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
        <p style="color: #888; font-size: 12px; text-align: center;">
            If you didn't request this email, you can safely ignore it.
        </p>
    </div>
    `;
};
