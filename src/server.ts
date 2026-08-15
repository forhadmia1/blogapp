import app from "./app";
import { prisma } from "./lib/prisma"

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to database!!');

        //server connect
        app.listen(process.env.PORT || "5000", () => {
            console.log(`Server is running on port ${process.env.PORT || "5000"}`)
        })

    } catch (error) {
        console.error('Error connecting to database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }

}
main()