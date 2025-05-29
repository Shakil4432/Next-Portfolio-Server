import prisma from "../../helper/prisma";
import * as bcrypt from "bcrypt";

import httpStatus from "http-status";

import config from "../../config";
import { Secret } from "jsonwebtoken";

import { IResetPassword } from "./auth.interface";

import AppError from "../../error/AppError";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";

const loginUserIntoDB = async (payload: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const incorrectPassword = await bcrypt.compare(
    payload.password,
    userData?.password as string
  );
  if (!incorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect");
  }

  const jwtPayloadData = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(
    jwtPayloadData,
    config.jwt.jwt_access_secret as Secret,
    config.jwt.jwt_access_expires_in as string
  );
  const refreshToken = generateToken(
    jwtPayloadData,
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenIntoDB = async (token: string) => {
  const decoded: any = verifyToken(
    token,
    config.jwt.jwt_refresh_secret as Secret
  );

  const { email } = decoded;

  const userData = await prisma.user.findFirstOrThrow({
    where: { email },
  });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const jwtPayloadData = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(
    jwtPayloadData,
    config.jwt.jwt_access_secret as Secret,
    config.jwt.jwt_access_expires_in as string
  );
  return {
    accessToken,
  };
};

const LogoutIntoDB = async () => {
  return null;
};

const resetPasswordIntoDB = async (payload: IResetPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return null;
};

export const AuthService = {
  loginUserIntoDB,
  refreshTokenIntoDB,
  LogoutIntoDB,
  resetPasswordIntoDB,
};
