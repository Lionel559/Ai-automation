import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";
import Notification from "@/models/Notification";

export const runtime = "nodejs";

type NotificationRecord = {
  _id: unknown;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .lean<NotificationRecord[]>(),
      Notification.countDocuments({ userId: user.id, isRead: false }),
    ]);

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: notifications.map((notification) => ({
        id: String(notification._id),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt?.toISOString() ?? "",
        updatedAt: notification.updatedAt?.toISOString() ?? "",
      })),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not load notifications." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    await Notification.updateMany(
      { userId: user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not update notifications." },
      { status: 500 }
    );
  }
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Authentication required." },
    { status: 401 }
  );
}
