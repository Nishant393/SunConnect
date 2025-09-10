import mongoose, { Schema, model } from "mongoose";

const clientSchema = new Schema(
    {
        name: { type: String, required: true },
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            match: /^[+]?[0-9]{10,14}$/, // Validate mobile number
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        about: { type: String, required: true },
        description: { type: String, required: true },
        avgRating: { type: Number, min: 0, max: 5 },
        enrolledStudent: { type: Number, min: 0 },
        language: { type: String, required: true },
        instructor: { type: String, required: true },
        curriculam: { type: [String], required: true },
        whatYouWillLearn: { type: [String], required: true },
        duration: {
            type: Number,
            required: true,
            min: 1,
            description: "Duration in months"
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        skill: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert", "beginner", "intermediate", "advanced", "expert"]
        },
        certificate: { type: Boolean, required: true },
        lecture: { type: Number, required: true, min: 1 },
        courseUrl: {
            public_id: { type: String },
            url: { type: String }
        }
    },
    {
        timestamps: true,
    }
);

export const Course = mongoose.models.Client || model("Client", clientSchema);
