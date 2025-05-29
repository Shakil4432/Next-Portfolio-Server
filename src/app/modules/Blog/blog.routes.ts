import { NextFunction, Request, Response } from "express";
import express from "express";
import { UserRole } from "../../../generated/prisma";
import auth from "../../middleware/auth";
import { FileUploader } from "../../helper/fileUploader";
import { blogValidations } from "./blog.validation";
import { blogController } from "./blog.controller";

const router = express.Router();

router.post(
  "/",
  FileUploader.upload.single("file"),
  auth(UserRole.ADMIN, UserRole.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = blogValidations.CreateBlogSchema.parse(
      JSON.parse(req.body.data)
    );
    return blogController.createBlog(req, res, next);
  }
);

router.get("/", blogController.getAllBlogs);

router.get("/:id", blogController.getSingleBlog);

router.delete("/:id", auth(UserRole.ADMIN), blogController.deleteSingleBlog);

router.patch(
  "/:id",
  FileUploader.upload.single("file"),
  auth(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = blogValidations.UpdateBlogSchema.parse(
      JSON.parse(req.body.data)
    );
    return blogController.updateBlog(req, res, next);
  }
);

export const blogRoutes = router;
