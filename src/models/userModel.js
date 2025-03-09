import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastname must be required."],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "mobile Number must be required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email must be required."],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [6, "Email must be at least 6 characters long"],
      maxLength: [50, "Email must not be longer than 50 characters"],
    },
    // password: {
    //   type: String,
    //   required: [true, "Password must be required."],
    //   select: false,
    // },
    age: {
      type: Number,
      required: [true, "Age is required."],
    },
    DOB: {
      type: Date,
      required: [true, "Date of Birth is required."],
      get: (date) => {
        if (!date || isNaN(date.getTime())) return null;
        return date.toLocaleDateString("en-GB");
      },
    },
    gender: {
      type: String,
      required: [true, "Gender must be required."],
    },

    pincode: {
      type: String,
      require: [true, "pincode must be required."],
    },
    city: {
      type: String,
      required: [true, "Enter the city name"],
    },
    state: {
      type: String,
      required: [true, "State must be required."],
    },
    familyMember: {
      type: Number,
      required: [true, "family member must be required."],
    },

    maritalStatus: {
      type: String,
      required: [true, "maritalStatus is required."],
    },
    education: {
      type: String,
      required: [true, "Education is must be required."],
    },
    occupation: {
      type: String,
      required: [true, "occupation is required."],
    },
    isHeadOfFamily: {
      type: Boolean,
      required: [true, "is Head of family member."],
    },

    village: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
