import courseModel from "../model/course.model";


export const createCourse = async (data: any) => {
    try {
        const course = await courseModel.create(data);
        return course;
    } catch (error: any) {
        throw new Error("Course creation failed: " + error.message);
    }
};
