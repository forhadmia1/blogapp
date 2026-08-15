import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { PostRouter } from "./modules/posts/posts.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express()


//using cors
app.use(cors(
    {
        origin: process.env.APP_URL as string,
        credentials: true
    }
))

//using express json
app.use(express.json())

//using express url encoded
app.use(express.urlencoded({ extended: true }))

//using better auth
app.all("/api/auth/*splat", toNodeHandler(auth));

//health check
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Welcome to the blog app"
    })
})

//add routers
app.use('/post', PostRouter)


export default app
