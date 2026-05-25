import Generation, { type GenerationType } from "@/models/Generation";

type SaveGenerationInput = {
  userId: string;
  type: GenerationType;
  prompt: string;
  response: string;
};

export async function saveGeneration({
  userId,
  type,
  prompt,
  response,
}: SaveGenerationInput) {
  await Generation.create({
    userId,
    type,
    prompt: prompt.trim(),
    response,
  });
}
