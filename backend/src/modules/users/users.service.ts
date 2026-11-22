import { AppError } from "../../shared/errors/app-error.js";
import { createUser as CreateUserRepositoryInput, findUserByEmail , updateUserById , findAllUsers, findUserById, deleteUserById} from "./user.repository.js";
import  type {CreateUserInput,  UpdateUserInput } from "./user.schema.js";
import { error } from "node:console";
import bcrypt from "bcrypt"



export async function registerUser(data: CreateUserInput){

    const { password, ...userData } = data;
    const SALT_ROUNDS = 12;

   const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
   const existingUser =  await findUserByEmail(data.email)

    if (existingUser) {
    throw new AppError("e-mail ja cadastrado", 409);
   }

    return CreateUserRepositoryInput({...userData, passwordHash,});
}

export async function updateUser(id: number, data: UpdateUserInput) {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  if (data.email && data.email !== existingUser.email) {
    const emailOwner = await findUserByEmail(data.email);

    if (emailOwner) {
      throw new AppError("e-mail ja cadastrado", 409);
    }
  }

  return updateUserById(id, data);
}


export async function removeUser(id: number) {

    const existingUser = await findUserById(id)
    
        if(!existingUser) {

        throw new AppError("Usuario não encontrado", 409)
    }

    return deleteUserById(id)
}


export async function listAllUsers() {

    return await findAllUsers();
}


