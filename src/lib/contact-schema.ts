import { z } from "zod";

/**
 * Shared schema — validated client-side (react-hook-form) AND server-side
 * (the action re-validates because client validation is advisory only).
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  message: z
    .string()
    .min(10, "A message that short might not get the response you want")
    .max(2000, "Message is too long — keep it under 2,000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
