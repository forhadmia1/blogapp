import "dotenv/config";
import { prisma } from "../lib/prisma";
import { USER_ROLE } from "../middleware/auth";

async function seedAdminUser() {
    try {

        const payload = {
            name: 'Admin',
            email: process.env.ADMIN_EMAIL as string,
            password: process.env.ADMIN_PASSWORD as string,
            role: USER_ROLE.ADMIN,
            status: 'ACTIVE',
        }

        console.log('***checking admin user***')

        const existUser = await prisma.user.findUnique({
            where: { email: payload.email }
        })

        console.log('***exist user***', existUser)

        if (existUser) {
            throw Error('Admin user already exists')
        }

        console.log('***creating admin user***')
        const signupAdmin = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': process.env.BETTER_AUTH_URL as string
            },
            body: JSON.stringify(payload)
        })


        const data = await signupAdmin.json();

        console.log('***updating user data***', data)
        if (data) {
            await prisma.user.update({
                where: { email: payload.email },
                data: {
                    emailVerified: true
                }
            })
        }

        console.log("***admin user created successfully***", data)
        return data
    } catch (error) {
        console.error("Error creating admin user", error)
        return null
    }
}

seedAdminUser()

