import bcrypt from "bcrypt";
import prisma from "../../helper/prisma";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../helper/paginationHelper";

import { userSearchAbleFields } from "./user.constants";
import { Prisma } from "@prisma/client";
const UserRegisterIntoDB = async (payload: any) => {
  console.log(payload);
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  payload.password = hashedPassword;

  const result = await prisma.$transaction(async (tx) => {
    const verifyUser = await tx.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (verifyUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "User already Created");
    }
    const createUser = prisma.user.create({
      data: payload,
    });
    return createUser;
  });
  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchAbleFields.map((filed) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
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
  const total = await prisma.user.count({
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
};

const getUserByIdIntoDB = async (id: string) => {
  const verify = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!verify) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not found!");
  }
  const result = await prisma.user.findUnique({
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
};

const deleteUserIntoDB = async (id: string) => {
  await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedUser = await tx.user.delete({
      where: { id },
    });

    return deletedUser;
  });

  return result;
};

const updateUserIntoDB = async (req: any) => {
  const { id } = req.params;

  const result = await prisma.$transaction(async (tx) => {
    const verifyUser = await tx.user.findUniqueOrThrow({
      where: { id },
    });

    const update = await prisma.user.update({
      where: { id, email: verifyUser.email },
      data: req.body,
    });

    return update;
  });
  return result;
};

export const userServices = {
  UserRegisterIntoDB,
  getAllFromDB,
  getUserByIdIntoDB,
  deleteUserIntoDB,
  updateUserIntoDB,
};
