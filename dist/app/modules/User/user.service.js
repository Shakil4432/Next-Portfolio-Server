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
exports.userServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const user_constants_1 = require("./user.constants");
const UserRegisterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    payload.password = hashedPassword;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verifyUser = yield tx.user.findFirst({
            where: {
                email: payload.email,
            },
        });
        if (verifyUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already Created");
        }
        const createUser = prisma_1.default.user.create({
            data: payload,
        });
        return createUser;
    }));
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: user_constants_1.userSearchAbleFields.map((filed) => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePhoto: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getUserByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
    });
    if (!verify) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Not found!");
    }
    const result = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePhoto: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedUser = yield tx.user.delete({
            where: { id },
        });
        return deletedUser;
    }));
    return result;
});
const updateUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verifyUser = yield tx.user.findUniqueOrThrow({
            where: { id },
        });
        const update = yield prisma_1.default.user.update({
            where: { id, email: verifyUser.email },
            data: req.body,
        });
        return update;
    }));
    return result;
});
exports.userServices = {
    UserRegisterIntoDB,
    getAllFromDB,
    getUserByIdIntoDB,
    deleteUserIntoDB,
    updateUserIntoDB,
};
