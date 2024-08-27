import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { authorizeRoles } from '../controllers/user.controller';
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analytics.controller';

const analyticsRouter = express.Router();

analyticsRouter.get("/get-user-analytics", isAuthenticated, authorizeRoles("admin"), getUserAnalytics);

analyticsRouter.get("/get-course-analytics", isAuthenticated, authorizeRoles("admin"), getCourseAnalytics);

analyticsRouter.get("/get-order-analytics", isAuthenticated, authorizeRoles("admin"), getOrderAnalytics);

export default analyticsRouter;
