"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is reqired" }),
        email: zod_1.z.string({ required_error: "Email is reqired" }),
        password: zod_1.z.string({ required_error: "Password is reqired" }),
        role: zod_1.z.string().optional(),
    }),
});
const updateUserValidation = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
});
exports.UserValidations = {
    createUserValidation,
    updateUserValidation,
};
