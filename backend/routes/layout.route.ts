import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { authorizeRoles } from '../controllers/user.controller';
import { createLayout, deleteLayout, editLayout, getAllLayouts, getLayoutByType } from '../controllers/layout.controller';

const layoutRouter = express.Router();

layoutRouter.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout);

layoutRouter.get("/get-layouts", isAuthenticated, getAllLayouts);

layoutRouter.put("/edit-layout/:id", isAuthenticated, authorizeRoles("admin"), editLayout);

layoutRouter.delete("/delete-layout/:id", isAuthenticated, authorizeRoles("admin"), deleteLayout);

layoutRouter.get("/get-layout-by-type/:type", getLayoutByType);


export default layoutRouter