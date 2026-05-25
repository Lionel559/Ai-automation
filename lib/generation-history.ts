import Generation, { type GenerationType } from "@/models/Generation";
import Notification from "@/models/Notification";

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

  const notification = getGenerationNotification(type);

  await Notification.create({
    userId,
    title: notification.title,
    message: notification.message,
    type: "success",
    isRead: false,
  });
}

function getGenerationNotification(type: GenerationType) {
  switch (type) {
    case "caption":
      return {
        title: "Caption generated",
        message: "Your new captions are ready to use.",
      };
    case "invoice":
      return {
        title: "Invoice created",
        message: "Your invoice was created successfully.",
      };
    case "faq":
      return {
        title: "FAQ answer generated",
        message: "Your customer answer is ready.",
      };
    case "product-description":
      return {
        title: "Product description generated",
        message: "Your product copy is ready to share.",
      };
    case "reply":
      return {
        title: "Reply generated",
        message: "Your customer reply is ready.",
      };
  }
}
