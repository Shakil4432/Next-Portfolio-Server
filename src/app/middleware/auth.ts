import status from "http-status";
import { catchAsync } from "../helper/catchAsync";
import config from "../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import AppError from "../error/AppError";
import verifyToken from "../utils/verifyToken";
import { UserRole } from "../../generated/prisma";

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    let token = null;

    token = req.headers.authorization;

    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "You are not Authorized");
    }

    const decoded = await verifyToken(
      token,
      config.jwt.jwt_access_secret as Secret
    );

    const role = (decoded as JwtPayload).role;

    if (roles && !roles.includes(role as UserRole)) {
      throw new AppError(status.UNAUTHORIZED, "You are not Authorized");
    }
    req.user = decoded;
    next();
  });
};

export default auth;
