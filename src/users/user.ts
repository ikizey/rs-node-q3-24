import { v4 as uuid } from "uuid";

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type UserData = {
  username?: string;
  age?: number;
  hobbies?: string[];
};

const validateUsername = (username?: unknown) => {
  if (typeof username === "string" && username.length > 0) {
    return { isValid: true, username };
  }

  return { isValid: false, username: null };
};

const validateAge = (age?: unknown) => {
  if (
    typeof age === "number" &&
    Number.isFinite(age) &&
    Number.isSafeInteger(age) &&
    age > 0
  ) {
    return { isValid: true, age: age };
  }

  return { isValid: false, age: null };
};

const validateHobbies = (hobbies?: unknown[]) => {
  if (
    Array.isArray(hobbies) &&
    hobbies.every((hobby) => typeof hobby === "string") &&
    hobbies.length > 0
  ) {
    return { isValid: true, hobbies: hobbies as string[] };
  }

  return { isValid: false, hobbies: null };
};

export const userCreate = (
  userData: UserData | undefined
): { error: string; user: null } | { error: null; user: User } => {
  const errors: string[] = [];
  if (!userData?.username) {
    errors.push("Username is required");
  }

  const { isValid: isValidUsername, username: username } = validateUsername(
    userData?.username
  );
  if (!isValidUsername) {
    errors.push("Username is invalid");
  }

  if (!userData?.age) {
    errors.push("Age is required");
  }

  const { isValid: isValidAge, age: age } = validateAge(userData?.age);
  if (!isValidAge) {
    errors.push("Age is invalid");
  }

  if (!userData?.hobbies) {
    errors.push("Hobbies are required");
  }

  const { isValid: isValidHobbies, hobbies: hobbies } = validateHobbies(
    userData?.hobbies
  );
  if (!isValidHobbies) {
    errors.push("Hobbies are invalid");
  }

  if (errors.length > 0) {
    return { error: errors.join(", "), user: null };
  }

  const userId = uuid();

  return {
    user: { id: userId, username, age, hobbies } as User,
    error: null,
  };
};

export const userUpdate = (
  userData: UserData | undefined,
  user: User
): User => {
  if (!userData) {
    return user;
  }

  const { username: username } = validateUsername(userData.username);
  const { age: age } = validateAge(userData.age);
  const { hobbies: hobbies } = validateHobbies(userData.hobbies);

  const newUsername = username ?? user.username;
  const newAge = age ?? user.age;
  const newHobbies = hobbies ?? user.hobbies;

  const updatedUser: User = {
    id: user.id,
    username: newUsername,
    age: newAge,
    hobbies: newHobbies,
  };

  return updatedUser;
};
