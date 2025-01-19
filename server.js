import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import useRoute from './routes/userRoute.js'
import  errorHandler  from './middleWares/errorMiddleware.js'
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express()

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json()) 

// Route Middleware
app.use('/api/users', useRoute);

// Error-handling middleware should come after all routes
app.use(errorHandler);
// Connect to db
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)

// Start Server

app.listen(PORT);

