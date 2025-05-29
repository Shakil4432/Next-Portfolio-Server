import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import pick from "../../utils/pick";
import { blogSearchableFields } from "./blog.constants";
import { blogServices } from "./blog.services";
import httpStatus from "http-status";

const createBlog = catchAsync(async (req, res) => {
  const result = await blogServices.createBlogIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const filters = pick(req.query, blogSearchableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await blogServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.getBlogByIdIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single blog retrieved successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await blogServices.updateBlogIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

const deleteSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogServices.deleteBlogIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: result,
  });
});

export const blogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteSingleBlog,
};
