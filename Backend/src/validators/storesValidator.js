import { z } from "zod";

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(60, "Store name must not exceed 60 characters"),
  email: z.string().email("Invalid email format"),
  address: z.string().max(400, "Address must not exceed 400 characters"),
  owner_id: z.number().optional().nullable(),
});