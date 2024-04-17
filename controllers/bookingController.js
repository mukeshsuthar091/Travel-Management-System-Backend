import dotenv from "dotenv";
import Stripe from "stripe";

import Booking from "../models/booking.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
// console.log("process.env.STRIPE_KEY:   ", process.env.STRIPE_KEY);

// create new booking
export const createBooking = async (req, res) => {
  const { tourPackage } = req.body;
  const newBooking = new Booking(tourPackage);
  
  try {

    const lineItems = [{
      price_data: {
        currency: "inr",
        product_data: {
          name: tourPackage.tourName,
        },
        unit_amount: tourPackage.totalAmount * 100,
      },
      quantity: tourPackage.guestSize,
    }]

    // console.log("tourPackage", lineItems)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    })

  // console.log("session", session.id)

  const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Your tour is booked",
      // data: savedBooking,
      sessionId: session.id,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "internal server error",
    });
  }
};

// get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Booking.findById(id);

    res.status(200).json({
      success: true,
      message: "successful",
      data: book,
    });
  } catch (err) {
    res.status(404).json({
      success: true,
      message: "not found",
    });
  }
};

// get all booking
export const getAllBooking = async (req, res) => {
  try {
    const books = await Booking.find();

    res.status(200).json({
      success: true,
      message: "successful",
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: "internal server error",
    });
  }
};
