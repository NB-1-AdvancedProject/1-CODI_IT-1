import NotFoundError from "../lib/errors/NotFoundError";
import userRepository from "../repositories/userRepository";
import authService from "./authService";

async function getById(id: string) {
  return await userRepository.getById(id);
}

async function getUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError("User", email);
  }

  await authService.verifyPassword(password, user.password);
  return user;
}

export default { getUser, getById };
