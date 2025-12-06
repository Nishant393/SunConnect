const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
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
      password: {
         type: String,
         required: true,
      },
      project: {
         kiloWatts: { type: Number},       // system capacity in kW
         plateNo: { type: String },         // solar plate serial number
         company: { type: String, },         // solar plate company

         inverterCompany: { type: String}, // inverter manufacturer
         inverterModel: { type: String },                   // inverter model
         inverterCapacity: { type: Number },                // capacity in kW

         installationDate: { type: Date, default: Date.now }, // install date
         warrantyPeriod: { type: Number, default: 5 },        // warranty in years
         location: { type: String },                          // site address/city

         expectedGeneration: { type: Number },  // expected kWh/month
         currentGeneration: { type: Number },   // actual kWh generated
         meterNo: { type: String },              // electricity meter number
         totalCost: { type: Number },
         paidCost: { type: Number },
         remainingCost: { type: Number }
      },

      isVerified: {
         type: Boolean,
         default: false,
      },
      isAdmin: {
         type: Boolean,
         default: false
      },
      resetPasswordToken: {
         type: String,
         select: false,
      },
      resetPasswordExpires: {
         type: Date,
         select: false,
      }
   },
   {
      timestamps: true,
   }
);
module.exports = mongoose.model('User', userSchema);
