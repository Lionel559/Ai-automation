import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      default: "",
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
      index: true,
    },
    resetTokenExpiry: {
      type: Date,
      select: false,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
      required: true,
    },
    dailyLimit: {
      type: Number,
      default: 10,
      min: 0,
      required: true,
    },
    businessName: {
      type: String,
      default: "",
      trim: true,
    },
    defaultCurrency: {
      type: String,
      enum: ["USD", "NGN", "EUR", "GBP"],
      default: "NGN",
    },
    defaultPaymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Credit Card", "PayPal", "Crypto"],
      default: "Bank Transfer",
    },
    businessLogo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

const User =
  (models.User as Model<UserDocument> | undefined) ||
  model<UserDocument>("User", userSchema);

export default User;
