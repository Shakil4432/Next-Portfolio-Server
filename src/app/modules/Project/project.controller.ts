import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import pick from "../../utils/pick";
import { projectSearchableFields } from "./project.constants";
import { projectServices } from "./project.services";
import httpStatus from "http-status";

const createProject = catchAsync(async (req, res) => {
  const result = await projectServices.createProjectIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully!",
    data: result,
  });
});

const deleteSingleProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await projectServices.deleteProjectIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project is deleted Successfully!",
    data: result,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await projectServices.getSingleProjectFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Project is retrieved Successfully!",
    data: result,
  });
});

const getAllProject = catchAsync(async (req, res) => {
  const filters = pick(req.query, projectSearchableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await projectServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const result = await projectServices.updateProjectIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project is updated Successfully!",
    data: result,
  });
});

export const projectController = {
  createProject,
  getAllProject,
  deleteSingleProject,
  updateProject,
  getSingleProject,
};
