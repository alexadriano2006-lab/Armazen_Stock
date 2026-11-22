import type { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { success, z } from "zod";
import { registerUser, listAllUsers, updateUser, removeUser } from "./users.service.js";
import { error } from "node:console";
import { id } from "zod/locales";




export async function postUser(req: Request, res: Response): Promise <void>{

const validation = createUserSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: 'Dados inválidos.',
      errors: z.flattenError(validation.error),
    });
    return;
  }
  
  
  const user = await registerUser(validation.data);

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt

    },
  });
        
}

export async function patchUsers(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({ message: "ID do usuário inválido." });
    return;
  }

  const validation = updateUserSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Dados inválidos para atualização.",
      errors: z.flattenError(validation.error),
    });
    return;
  }

  const user = await updateUser(userId, validation.data);

  res.status(200).json({ user });
}

export async function deleteUser(req: Request, res: Response): Promise <void> {

  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({
      message: "ID do usuário inválido."
    });
    return;
  }

  const user = await removeUser(userId);

  res.status(200).json({
    message: "Usuário removido com sucesso.",
    user
  });
}

export async function getAllUsers(_req: Request, res: Response): Promise <void> {

    const allUsers = await listAllUsers()

    res.status(200).json(allUsers)
    
}