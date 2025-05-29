"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const project_routes_1 = require("../modules/Project/project.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const blog_routes_1 = require("../modules/Blog/blog.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/projects",
        route: project_routes_1.projectRoutes,
    },
    {
        path: "/blogs",
        route: blog_routes_1.blogRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
