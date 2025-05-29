"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectValidations = exports.updateProjectSchema = exports.CreateProjectSchema = void 0;
const zod_1 = require("zod");
exports.CreateProjectSchema = zod_1.z.object({
    project: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        technologies: zod_1.z.array(zod_1.z.string()),
        liveLink: zod_1.z.string().url(),
        githubLink: zod_1.z.string().url(),
    }),
});
exports.updateProjectSchema = zod_1.z.object({
    project: zod_1.z.object({
        name: zod_1.z.string().optional(),
        image: zod_1.z
            .array(zod_1.z.string().url({ message: "Invalid image URL format" }).or(zod_1.z.string()))
            .optional(),
        description: zod_1.z.string().optional(),
        technologies: zod_1.z.array(zod_1.z.string()).optional(),
        liveLink: zod_1.z.string().url().optional(),
        githubLink: zod_1.z.string().url().optional(),
    }),
});
exports.projectValidations = {
    CreateProjectSchema: exports.CreateProjectSchema,
    updateProjectSchema: exports.updateProjectSchema,
};
