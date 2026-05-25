import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const notificationTypes = ["success", "info", "warning"] as const;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: notificationTypes,
      default: "info",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;
export type NotificationType = (typeof notificationTypes)[number];

const Notification =
  (models.Notification as Model<NotificationDocument> | undefined) ||
  model<NotificationDocument>("Notification", notificationSchema);

export default Notification;
