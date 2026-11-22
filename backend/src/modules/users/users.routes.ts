import { Router } from "express";
import { postUser, getAllUsers, patchUsers, deleteUser } from "./users.controller.js";

const userRoute = Router();


userRoute.post('/', postUser);
userRoute.get('/', getAllUsers)
userRoute.patch('/:id', patchUsers)
userRoute.delete('/:id', deleteUser)

export default userRoute;

