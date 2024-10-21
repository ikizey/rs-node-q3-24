import {
  type User,
  type UserData,
  userCreate,
  userUpdate,
} from "../users/user";

const users = new Map<string, User>();

const addUser = (userData: UserData) => {
  const result = userCreate(userData);
  if (result.error !== null) {
    return { status: "error", error: result.error };
  }

  users.set(result.user.id, result.user);
  return { status: "success", user: result.user };
};

const getAllUsers = () => {
  return { status: "success", users: Array.from(users.values()) };
};

export const getUserById = (id: string) => {
  if (!users.has(id)) {
    return { status: "error", error: "User not found" };
  }
  return { status: "success", user: users.get(id) as User };
};

const updateUser = (id: string, userData: UserData) => {
  if (!users.has(id)) {
    return { status: "error", error: "User not found" };
  }
  const user = users.get(id) as User;
  const updatedUser = userUpdate(userData, user);
  users.set(id, updatedUser);
  return { status: "success", user: updatedUser };
};

const deleteUser = (id: string) => {
  if (!users.has(id)) {
    return { status: "error", error: "User not found" };
  }
  users.delete(id);
  return { status: "success" };
};

export const db = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
