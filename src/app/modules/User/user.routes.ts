import express from "express";

import { UserValidations } from "./user.validation";
import { userControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidations.createUserValidation),
  userControllers.RegisterUser
);

router.get("/", userControllers.getAllUserData);
router.get("/:id", userControllers.getUserById);
router.patch(
  "/:id",
  validateRequest(UserValidations.updateUserValidation),
  userControllers.UpdateUser
);
router.delete("/:id", userControllers.DeleteUser);

export const userRoutes = router;
