import express from "express";
import { AuthController } from "./auth.controller";

import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma";
import { authValidation } from "./auth.validation";

const router = express.Router();

router.post("/login", AuthController.LoginUser);
router.post(
  "/refreshtoken",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.refreshToken
);
router.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSchema),
  AuthController.resetPassword
);
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
