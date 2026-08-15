import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "../utils/emailTemplate";



// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [process.env.APP_URL as string],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: 'USER'
            },
            phone: {
                type: 'string',
                required: false
            },
            status: {
                type: 'string',
                required: false,
                defaultValue: 'ACTIVE'
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const info = await transporter.sendMail({
                    from: process.env.SMTP_USER as string,
                    to: 'forhad8613@gmail.com',
                    subject: "Email Verification",
                    text: `Verify your email address: ${url}`,
                    html: getVerificationEmailTemplate(url, user.name),
                });
            } catch (error) {
                console.log(error)
            }
        },
    },
    socialProviders: {
        google: {
            prompt: 'select_account consent',
            accessType: 'offline',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
