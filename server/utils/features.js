import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// MongoDB connection function
const connectDB = (url) => {
    mongoose.connect(url, { dbName: "solar" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
            console.error("Error connecting to DB:", err);
            process.exit(1);
        });
};

// Cookie options
const cookieOption = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "none", // Corrected "samesite" to "sameSite"
    httpOnly: true,   // Prevent JavaScript access to cookies
    secure: true,     // Ensure cookies are only sent over HTTPS
};

// Send JWT token function
const sendToken = (res, user, code, message) => {
    if (!user || !user._id) {
        throw new Error("Invalid user object");
    }

    const token = jwt.sign({ _id: user._id },"key", { expiresIn: '2d' });
    // Fixed env variable key
    return res.status(code)
        .cookie("sunConnect", token, cookieOption)
        .json({
            success: true,
            message,
            token,
        });
};

// Sanitize user data
const sanitizeUser = (user) => {
    if (!user || typeof user !== "object") {
        throw new Error("Invalid user object");
    }
    return {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
    };
};

// Generate OTP function
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export { connectDB, sendToken, cookieOption, sanitizeUser, generateOTP};
