"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../../generated/prisma");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUploader_1 = require("../../helper/fileUploader");
const blog_validation_1 = require("./blog.validation");
const blog_controller_1 = require("./blog.controller");
const router = express_1.default.Router();
router.post("/", fileUploader_1.FileUploader.upload.single("file"), (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.USER), (req, res, next) => {
    req.body = blog_validation_1.blogValidations.CreateBlogSchema.parse(JSON.parse(req.body.data));
    return blog_controller_1.blogController.createBlog(req, res, next);
});
router.get("/", blog_controller_1.blogController.getAllBlogs);
router.get("/:id", blog_controller_1.blogController.getSingleBlog);
router.delete("/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), blog_controller_1.blogController.deleteSingleBlog);
router.patch("/:id", fileUploader_1.FileUploader.upload.single("file"), (0, auth_1.default)(prisma_1.UserRole.ADMIN), (req, res, next) => {
    req.body = blog_validation_1.blogValidations.UpdateBlogSchema.parse(JSON.parse(req.body.data));
    return blog_controller_1.blogController.updateBlog(req, res, next);
});
exports.blogRoutes = router;
