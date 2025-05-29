"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const prisma_1 = require("../../../generated/prisma");
const fileUploader_1 = require("../../helper/fileUploader");
const project_validation_1 = require("./project.validation");
const project_controller_1 = require("./project.controller");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/", fileUploader_1.FileUploader.upload.single("file"), (0, auth_1.default)(prisma_1.UserRole.ADMIN), (req, res, next) => {
    console.log(req.body.data);
    req.body = project_validation_1.projectValidations.CreateProjectSchema.parse(JSON.parse(req.body.data));
    return project_controller_1.projectController.createProject(req, res, next);
});
router.get("/", project_controller_1.projectController.getAllProject);
router.get("/:id", project_controller_1.projectController.getSingleProject);
router.delete("/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), project_controller_1.projectController.deleteSingleProject);
router.patch("/:id", (0, auth_1.default)(prisma_1.UserRole.USER), fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = project_validation_1.projectValidations.updateProjectSchema.parse(JSON.parse(req.body.data));
    return project_controller_1.projectController.updateProject(req, res, next);
});
exports.projectRoutes = router;
