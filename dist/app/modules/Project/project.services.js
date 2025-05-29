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
exports.projectServices = exports.createProjectIntoDB = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const http_status_1 = __importDefault(require("http-status"));
const project_constants_1 = require("./project.constants");
const fileUploader_1 = require("../../helper/fileUploader");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createProjectIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = req.file;
    console.log(file);
    const payload = req.body;
    console.log(req.body);
    console.log(req.user);
    // 1. Handle file upload
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        if (uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url) {
            payload.project.image = uploadData.secure_url;
        }
    }
    // 2. Get the authenticated user's ID (must be set by your auth middleware)
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new Error("Unauthorized: no user ID found on request");
    }
    // 3. Create project with connected user
    const result = yield prisma_1.default.project.create({
        data: Object.assign(Object.assign({}, payload.project), { user: {
                connect: { id: userId },
            } }),
    });
    return result;
});
exports.createProjectIntoDB = createProjectIntoDB;
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: project_constants_1.projectSearchableFields.map((field) => ({
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
    const where = andConditions.length
        ? { AND: andConditions }
        : {};
    const data = yield prisma_1.default.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { name: "asc" },
        select: {
            id: true,
            name: true,
            image: true,
            description: true,
            technologies: true,
            liveLink: true,
            githubLink: true,
        },
    });
    const total = yield prisma_1.default.project.count({ where });
    return {
        meta: { page, limit, total },
        data,
    };
});
const getProjectByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.project.findUniqueOrThrow({ where: { id } });
    const project = yield prisma_1.default.project.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            image: true,
            description: true,
            technologies: true,
            liveLink: true,
            githubLink: true,
        },
    });
    return project;
});
const updateProjectIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.project.image = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
    }
    const verifycontent = yield prisma_1.default.project.findUnique({
        where: { id },
    });
    if (!verifycontent) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Content is not found!!");
    }
    const result = yield prisma_1.default.project.update({
        where: { id },
        data: req.body.project,
    });
    return result;
});
const getSingleProjectFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.project.findUniqueOrThrow({
        where: { id },
    });
    const result = yield prisma_1.default.project.findUnique({
        where: { id },
    });
    return result;
});
const deleteProjectIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.project.findUniqueOrThrow({ where: { id } });
    const deleted = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        return tx.project.delete({ where: { id } });
    }));
    return deleted;
});
exports.projectServices = {
    createProjectIntoDB: exports.createProjectIntoDB,
    getAllFromDB,
    getProjectByIdIntoDB,
    updateProjectIntoDB,
    deleteProjectIntoDB,
    getSingleProjectFromDB,
};
