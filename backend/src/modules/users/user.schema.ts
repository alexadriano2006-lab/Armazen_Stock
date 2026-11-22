import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(["ADMIN", "OPERATOR"]),
});


export const updateUserSchema = createUserSchema
  .partial()
  .transform((obj) =>
    Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined))
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização.",
  });

  
export type CreateUserInput = z.infer<typeof createUserSchema>

export type UpdateUserInput = z.infer<typeof updateUserSchema>