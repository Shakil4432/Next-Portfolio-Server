import prisma from "../../helper/prisma";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../helper/paginationHelper";
import httpStatus from "http-status";
import { projectSearchableFields } from "./project.constants";
import { FileUploader } from "../../helper/fileUploader";
import { IFile } from "../../interface/file.type";
import AppError from "../../error/AppError";
import { Prisma } from "@prisma/client";

export const createProjectIntoDB = async (req: any) => {
  const file = req.file;
  console.log(file);
  const payload = req.body;
  console.log(req.body);

  console.log(req.user);

  // 1. Handle file upload
  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    if (uploadData?.secure_url) {
      payload.project.image = uploadData.secure_url;
    }
  }

  // 2. Get the authenticated user's ID (must be set by your auth middleware)
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("Unauthorized: no user ID found on request");
  }

  // 3. Create project with connected user
  const result = await prisma.project.create({
    data: {
      ...payload.project,
      user: {
        connect: { id: userId },
      },
    },
  });

  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ProjectWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: projectSearchableFields.map((field) => ({
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

  const where: Prisma.ProjectWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const data = await prisma.project.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
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

  const total = await prisma.project.count({ where });

  return {
    meta: { page, limit, total },
    data,
  };
};

const getProjectByIdIntoDB = async (id: string) => {
  await prisma.project.findUniqueOrThrow({ where: { id } });

  const project = await prisma.project.findUnique({
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
};

const updateProjectIntoDB = async (req: any) => {
  const { id } = req.params;
  const file = req.file as IFile;

  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    req.body.project.image = uploadData?.secure_url;
  }

  const verifycontent = await prisma.project.findUnique({
    where: { id },
  });

  if (!verifycontent) {
    throw new AppError(httpStatus.BAD_REQUEST, "Content is not found!!");
  }

  const result = await prisma.project.update({
    where: { id },
    data: req.body.project,
  });

  return result;
};

const getSingleProjectFromDB = async (id: string) => {
  await prisma.project.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.project.findUnique({
    where: { id },
  });

  return result;
};

const deleteProjectIntoDB = async (id: string) => {
  await prisma.project.findUniqueOrThrow({ where: { id } });

  const deleted = await prisma.$transaction(async (tx) => {
    return tx.project.delete({ where: { id } });
  });

  return deleted;
};

export const projectServices = {
  createProjectIntoDB,
  getAllFromDB,
  getProjectByIdIntoDB,
  updateProjectIntoDB,
  deleteProjectIntoDB,
  getSingleProjectFromDB,
};
