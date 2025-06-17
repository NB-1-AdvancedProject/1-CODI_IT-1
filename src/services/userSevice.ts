import userRepository from "../repositories/userRepository";

const getById = async (id: string) => {
  return await userRepository.getById(id);
};
