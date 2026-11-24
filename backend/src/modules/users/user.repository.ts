import { prisma } from "../../config/database.js";
import { type CreateUserInput, type UpdateUserInput } from "./user.schema.js";

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  registrationSource: true,
  createdAt: true,
  updatedAt: true,
} as const;

type CreateUserRepositoryInput = Omit<CreateUserInput, 'password'> & {
  passwordHash: string;
};

export async function createUser(data: CreateUserRepositoryInput) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.passwordHash,
      ...(data.role !== undefined && { role: data.role }),
    },
    select: publicUserSelect
  });
}

type UpdateUserRepositoryInput = Omit<UpdateUserInput, 'password'> & {
  passwordHash?: string;
};


export async function updateUserById(id: number, data: UpdateUserRepositoryInput) {
  return prisma.user.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.passwordHash !== undefined && { password: data.passwordHash }),
      ...(data.role !== undefined && { role: data.role }),
    },
    select: publicUserSelect,
  });
}


export async function deleteUserById(id: number){
  return await prisma.user.delete({
    where: {id}
  })
}

export async function findAllUsers(){
    return await prisma.user.findMany({
        orderBy: { id: 'asc'},
        select: publicUserSelect
    })
} 

export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect
  });
}


export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: publicUserSelect
  });
}