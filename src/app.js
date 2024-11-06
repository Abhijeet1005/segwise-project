import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';

const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser())
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ limit: '16kb', extended: true }))

//Define router imports and router specific middlewares here
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';

app.get('/', (req, res) => {
    res.status(200).json({ "status": "working" })
})
app.use('/api/v1/user', userRouter)
app.use('/api/v1/review', reviewRouter)

//Global error handler
app.use(errorHandler)

export { app }