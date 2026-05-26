import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { forbiddenOriginResponse, isAllowedOrigin } from "@/lib/csrf";
import Generation from "@/models/Generation";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbiddenOriginResponse();
    }

    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid generation id." },
        { status: 400 }
      );
    }

    const deletedGeneration = await Generation.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!deletedGeneration) {
      return NextResponse.json(
        { success: false, message: "Generation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Generation deleted.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not delete generation." },
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
