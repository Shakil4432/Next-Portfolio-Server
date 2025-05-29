import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constants";
import { userServices } from "./user.service";
import httpStatus from "http-status";

const RegisterUser = catchAsync(async (req, res) => {
  const result = await userServices.UserRegisterIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Register Successfully",
    data: result,
  });
});

const getAllUserData = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.getUserByIdIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data fetched!",
    data: result,
  });
});

const DeleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.deleteUserIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete user Successfully!",
  });
});

const UpdateUser = catchAsync(async (req, res) => {
  const result = await userServices.updateUserIntoDB(req);
  sendResponse(res, {
    success: true,
    message: "User update successfully!!",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const userControllers = {
  RegisterUser,
  getAllUserData,
  getUserById,
  DeleteUser,
  UpdateUser,
};
