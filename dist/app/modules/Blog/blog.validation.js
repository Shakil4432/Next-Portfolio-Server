"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidations = exports.UpdateBlogSchema = exports.CreateBlogSchema = void 0;
const zod_1 = require("zod");
exports.CreateBlogSchema = zod_1.z.object({
    blog: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        content: zod_1.z.string({ required_error: "Content is required" }),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        authorId: zod_1.z.string({ required_error: "Author ID is required" }),
    }),
});
exports.UpdateBlogSchema = zod_1.z.object({
    blog: zod_1.z.object({
        title: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.blogValidations = {
    CreateBlogSchema: exports.CreateBlogSchema,
    UpdateBlogSchema: exports.UpdateBlogSchema,
};
