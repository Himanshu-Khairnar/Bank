import express from 'express'
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend's origin
    credentials: true
}))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser()) 


import userRoutes from './routes/User.Routes.js'
import accountRoutes from './routes/Account.Routes.js'


app.use("/api/v1/users",userRoutes)
app.use("/api/v1/accounts",accountRoutes)


export default app;