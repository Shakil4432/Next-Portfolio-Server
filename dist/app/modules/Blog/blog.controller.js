"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const pick_1 = __importDefault(require("../../utils/pick"));
const blog_constants_1 = require("./blog.constants");
const blog_services_1 = require("./blog.services");
const http_status_1 = __importDefault(require("http-status"));
const createBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_services_1.blogServices.createBlogIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Blog created successfully!",
        data: result,
    });
}));
const getAllBlogs = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, blog_constants_1.blogSearchableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield blog_services_1.blogServices.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blogs retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blog_services_1.blogServices.getBlogByIdIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single blog retrieved successfully!",
        data: result,
    });
}));
const updateBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_services_1.blogServices.updateBlogIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blog updated successfully!",
        data: result,
    });
}));
const deleteSingleBlog = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blog_services_1.blogServices.deleteBlogIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blog deleted successfully!",
        data: result,
    });
}));
exports.blogController = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteSingleBlog,
};
