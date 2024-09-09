import { model, Schema } from "mongoose";

const authorsSchema = new Schema(
  {
    googleId: String,
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    date_of_birth: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      select: false, // ensures that the password is never selected
    },
    avatar: {
      type: String,
    },
    verifiedAt: Date,
    verificationCode: String,
  },
  { collection: "authors", timestamps: true }
);
export default model("Authors", authorsSchema);
