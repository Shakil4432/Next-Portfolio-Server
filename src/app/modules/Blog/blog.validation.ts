import { z } from "zod";

export const CreateBlogSchema = z.object({
  blog: z.object({
    title: z.string({ required_error: "Title is required" }),
    content: z.string({ required_error: "Content is required" }),
    tags: z.array(z.string()).optional(),
    authorId: z.string({ required_error: "Author ID is required" }),
  }),
});

export const UpdateBlogSchema = z.object({
  blog: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const blogValidations = {
  CreateBlogSchema,
  UpdateBlogSchema,
};
