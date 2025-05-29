import { z } from "zod";

export const CreateProjectSchema = z.object({
  project: z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    liveLink: z.string().url(),
    githubLink: z.string().url(),
  }),
});

export const updateProjectSchema = z.object({
  project: z.object({
    name: z.string().optional(),
    image: z
      .array(
        z.string().url({ message: "Invalid image URL format" }).or(z.string())
      )
      .optional(),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    liveLink: z.string().url().optional(),
    githubLink: z.string().url().optional(),
  }),
});

export const projectValidations = {
  CreateProjectSchema,
  updateProjectSchema,
};
