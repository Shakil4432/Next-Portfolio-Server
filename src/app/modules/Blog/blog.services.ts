import prisma from "../../helper/prisma";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "../../../generated/prisma";
import httpStatus from "http-status";
import { IBlog } from "./blog.interface";
import { FileUploader } from "../../helper/fileUploader";
import { IFile } from "../../interface/file.type";
import AppError from "../../error/AppError";
import { blogSearchableFields } from "./blog.constants";

export const createBlogIntoDB = async (req: any) => {
  const file = req.file as IFile | undefined;
  const payload: { blog: IBlog } = req.body;

  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    if (uploadData?.secure_url) {
      payload.blog.image = uploadData.secure_url;
    }
  }

  const authorId = req.user?.id;
  if (!authorId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const { authorId: _, ...blogFields } = payload.blog;

  const result = await prisma.blog.create({
    data: {
      ...blogFields,
      author: { connect: { id: authorId } },
    },
  });

  return result;
};

export const getAllFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const where: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.blog.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
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

  const total = await prisma.blog.count({ where });

  return {
    meta: { page, limit, total },
    data,
  };
};

export const getBlogByIdIntoDB = async (id: string) => {
  await prisma.blog.findUniqueOrThrow({ where: { id } });

  const blog = await prisma.blog.findUnique({
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
};

export const updateBlogIntoDB = async (req: any) => {
  const { id } = req.params;
  const file = req.file as IFile | undefined;
  const payload: { blog: Partial<IBlog> } = req.body;

  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    if (uploadData?.secure_url) {
      payload.blog.image = uploadData.secure_url;
    }
  }

  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const updated = await prisma.blog.update({
    where: { id },
    data: payload.blog,
  });

  return updated;
};

export const deleteBlogIntoDB = async (id: string) => {
  await prisma.blog.findUniqueOrThrow({ where: { id } });

  const deleted = await prisma.$transaction(async (tx) => {
    return tx.blog.delete({ where: { id } });
  });

  return deleted;
};

export const blogServices = {
  createBlogIntoDB,
  getAllFromDB,
  getBlogByIdIntoDB,
  updateBlogIntoDB,
  deleteBlogIntoDB,
};
