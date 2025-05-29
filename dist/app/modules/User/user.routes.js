"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.UserValidations.createUserValidation), user_controller_1.userControllers.RegisterUser);
router.get("/", user_controller_1.userControllers.getAllUserData);
router.get("/:id", user_controller_1.userControllers.getUserById);
router.patch("/:id", (0, validateRequest_1.default)(user_validation_1.UserValidations.updateUserValidation), user_controller_1.userControllers.UpdateUser);
router.delete("/:id", user_controller_1.userControllers.DeleteUser);
exports.userRoutes = router;
