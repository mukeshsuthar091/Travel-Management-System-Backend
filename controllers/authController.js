import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "danyka.hettinger35@ethereal.email",
    pass: "Ntwea5q762nwTX9JvU",
  },
});

// user registration
export const register = async (req, res) => {
  // console.log(req.body)

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt); // this is return direct hash result

    // const hash = bcrypt.hash(req.body.password, 12);   // this is return promise of hash
    const newUser = new User({
      username: req.body.userName,
      email: req.body.email,
      password: hash,
      photo: req.body.photo,
    });

    await newUser.save();

    transporter
      .sendMail({
        to: req.body.email,
        from: "travel-world@gmail.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      })
      .then((info) => {
        console.log("Message sent : %s", info.messageId);
      });

    res.status(200).json({
      success: true,
      message: "Successfully created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to created. Try again",
    });
  }
};

// user login
export const login = async (req, res) => {
  const email = req.body.email;
  // console.log(req.body)

  try {
    const user = await User.findOne({ email: email });
    // if user doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // if user is exist then check then password or compare the password
    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //if password is incorrect
    if (!checkCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const { password, role, ...rest } = user._doc;

    // create jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // console.log(user.role);
    // set token in the browser cookies and send the response to the client
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        // success: true,
        // message: "successfully login",
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
