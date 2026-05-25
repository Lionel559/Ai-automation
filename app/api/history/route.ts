import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import Generation, {
  generationTypes,
  type GenerationType,
} from "@/models/Generation";

export const runtime = "nodejs";

type GenerationRecord = {
  _id: unknown;
  type: GenerationType;
  prompt: string;
  response: string;
  createdAt?: Date;
};

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    let selectedType: GenerationType | undefined;

    if (typeParam) {
      if (!isGenerationType(typeParam)) {
        return NextResponse.json(
          { success: false, message: "Invalid generation type." },
          { status: 400 }
        );
      }

      selectedType = typeParam;
    }

    const query: { userId: string; type?: GenerationType } = {
      userId: user.id,
    };

    if (selectedType) {
      query.type = selectedType;
    }

    const generations = (await Generation.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()) as GenerationRecord[];

    return NextResponse.json({
      success: true,
      generations: generations.map((generation) => ({
        id: String(generation._id),
        type: generation.type,
        prompt: generation.prompt,
        response: generation.response,
        createdAt: generation.createdAt?.toISOString() ?? "",
      })),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Could not load generation history." },
      { status: 500 }
    );
  }
}

function isGenerationType(type: string): type is GenerationType {
  return generationTypes.includes(type as GenerationType);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Authentication required." },
    { status: 401 }
  );
}
