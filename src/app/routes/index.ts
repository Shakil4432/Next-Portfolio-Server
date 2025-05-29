import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { projectRoutes } from "../modules/Project/project.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { blogRoutes } from "../modules/Blog/blog.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/projects",
    route: projectRoutes,
  },
  {
    path: "/blogs",
    route: blogRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
