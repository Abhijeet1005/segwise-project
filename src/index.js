import connectDB from "./utils/db.js";
import { app } from "./app.js";
import dotenv from 'dotenv';
import { job } from "./utils/Scheduler.js";
import { categorizeAndSave } from "./utils/CategorizeAndSave.js";

dotenv.config({
    path: './.env'
})

connectDB()
    .then(async (host) => {
        console.log(`MongoDB connected with host: ${host} *`)

        app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT} *`)
        })

        app.on('error', (err) => {
            console.log(`App initialization error ${err} *`)
        })
        await categorizeAndSave(process.env.appId, process.env.noOfReviews);
        job.start();
    })
    .catch((err) => {
        console.log(`Error occured : ${err} *`)
    })