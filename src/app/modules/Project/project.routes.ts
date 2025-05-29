import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../generated/prisma";
import { FileUploader } from "../../helper/fileUploader";

import { projectValidations } from "./project.validation";
import { projectController } from "./project.controller";
import express from "express";
import auth from "../../middleware/auth";
const router = express.Router();

router.post(
  "/",
  FileUploader.upload.single("file"),
  auth(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.data);
    req.body = projectValidations.CreateProjectSchema.parse(
      JSON.parse(req.body.data)
    );
    return projectController.createProject(req, res, next);
  }
);

router.get("/", projectController.getAllProject);
router.get("/:id", projectController.getSingleProject);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  projectController.deleteSingleProject
);
router.patch(
  "/:id",
  auth(UserRole.USER),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = projectValidations.updateProjectSchema.parse(
      JSON.parse(req.body.data)
    );
    return projectController.updateProject(req, res, next);
  }
);

export const projectRoutes = router;
