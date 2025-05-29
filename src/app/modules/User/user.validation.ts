import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is reqired" }),
    email: z.string({ required_error: "Email is reqired" }),
    password: z.string({ required_error: "Password is reqired" }),
    role: z.string().optional(),
  }),
});

const updateUserValidation = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
});

export const UserValidations = {
  createUserValidation,
  updateUserValidation,
};
