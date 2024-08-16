import express from 'express';
import { addQuestion, addQuestionReply, deleteCourse, editCourse, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from '../controllers/course.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
import { authorizeRoles } from '../controllers/user.controller';

const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated, authorizeRoles("admin"), uploadCourse)

courseRouter.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse)

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.delete("/delete-course/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQuestion);

courseRouter.put("/add-reply", isAuthenticated, addQuestionReply);


export default courseRouter