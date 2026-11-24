import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(["ADMIN", "OPERATOR"]),
});


export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>

export type UpdateUserInput = z.infer<typeof updateUserSchema>