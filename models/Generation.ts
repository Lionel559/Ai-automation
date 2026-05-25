import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const generationTypes = [
  "caption",
  "reply",
  "invoice",
  "faq",
  "product-description",
] as const;

const generationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: generationTypes,
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type GenerationDocument = InferSchemaType<typeof generationSchema>;
export type GenerationType = (typeof generationTypes)[number];

const Generation =
  (models.Generation as Model<GenerationDocument> | undefined) ||
  model<GenerationDocument>("Generation", generationSchema);

export default Generation;
