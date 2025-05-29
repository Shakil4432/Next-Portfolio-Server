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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogServices = exports.deleteBlogIntoDB = exports.updateBlogIntoDB = exports.getBlogByIdIntoDB = exports.getAllFromDB = exports.createBlogIntoDB = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../helper/fileUploader");
const AppError_1 = __importDefault(require("../../error/AppError"));
const blog_constants_1 = require("./blog.constants");
const createBlogIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = req.file;
    const payload = req.body;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        if (uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url) {
            payload.blog.image = uploadData.secure_url;
        }
    }
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!authorId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const _b = payload.blog, { authorId: _ } = _b, blogFields = __rest(_b, ["authorId"]);
    const result = yield prisma_1.default.blog.create({
        data: Object.assign(Object.assign({}, blogFields), { author: { connect: { id: authorId } } }),
    });
    return result;
});
exports.createBlogIntoDB = createBlogIntoDB;
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: blog_constants_1.blogSearchableFields.map((field) => ({
                [field]: { contains: searchTerm, mode: "insensitive" },
            })),
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: { equals: filterData[key] },
            })),
        });
    }
    const where = andConditions.length > 0 ? { AND: andConditions } : {};
    const data = yield prisma_1.default.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            content: true,
            image: true,
            tags: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.default.blog.count({ where });
    return {
        meta: { page, limit, total },
        data,
    };
});
exports.getAllFromDB = getAllFromDB;
const getBlogByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.blog.findUniqueOrThrow({ where: { id } });
    const blog = yield prisma_1.default.blog.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            image: true,
            tags: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return blog;
});
exports.getBlogByIdIntoDB = getBlogByIdIntoDB;
const updateBlogIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const payload = req.body;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        if (uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url) {
            payload.blog.image = uploadData.secure_url;
        }
    }
    const existing = yield prisma_1.default.blog.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    const updated = yield prisma_1.default.blog.update({
        where: { id },
        data: payload.blog,
    });
    return updated;
});
exports.updateBlogIntoDB = updateBlogIntoDB;
const deleteBlogIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.blog.findUniqueOrThrow({ where: { id } });
    const deleted = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        return tx.blog.delete({ where: { id } });
    }));
    return deleted;
});
exports.deleteBlogIntoDB = deleteBlogIntoDB;
exports.blogServices = {
    createBlogIntoDB: exports.createBlogIntoDB,
    getAllFromDB: exports.getAllFromDB,
    getBlogByIdIntoDB: exports.getBlogByIdIntoDB,
    updateBlogIntoDB: exports.updateBlogIntoDB,
    deleteBlogIntoDB: exports.deleteBlogIntoDB,
};
