import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import tourRoute from './routers/tours.js';
import userRoute from './routers/users.js';
import authRoute from './routers/auth.js';
import reviewRoute from './routers/reviews.js';
import bookingRoute from './routers/bookings.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
// const corsOptions = {
//   origin: true,
//   credentials : true
// }

const corsOptions = {
  origin: ['http://localhost:3000'], // Specify trusted origin(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true,
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);


// database connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,
      // {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // }
    );

    console.log("MongoDB database connected.");
  } catch (err) {
    console.log("MongoDB database connected failed.");
  }
};


app.listen(port, () => {
  connect();
  console.log("Sever listening on port ", port);
});



