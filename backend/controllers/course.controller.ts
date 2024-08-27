import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import courseModel from "../model/course.model";
import { redis } from "../utils/redis";
import { createCourse } from "../services/course.services";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail";
import notificatioModel from "../model/notification.model";
import userModel from "../model/user.model";

// Controller to handle course upload
export const uploadCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure required data from the request body
        const { thumbnail, ...courseData } = req.body;

        const user = await userModel.findById(req.user?._id);

        // If a thumbnail is provided, upload it to Cloudinary
        if (thumbnail) {
            const uploadResult = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });

            // Add the Cloudinary upload result to the course data
            courseData.thumbnail = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        } else {
            // Handle cases where thumbnail might be missing
            return next(new ErrorHandler("Thumbnail image is required", 400));
        }

        // Create the course using the service function
       const course = await createCourse({ ...courseData });

       
        // Create a notification for the user
        await notificatioModel.create({
            userId: user?._id,
            title: "New Order",
            message: `You have a new course ${course.name}`,
        });

        // Send response back to the client
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (err: any) {
        // Handle any errors that occur during the process
        console.error(err);
        return next(new ErrorHandler(err.message, 500));
    }
});

// Edit course controller
export const editCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        // Ensure courseId is provided
        if (!courseId) {
            return next(new ErrorHandler("Course ID is required", 400));
        }

        const data = req.body;

        // Handle thumbnail update if a new one is provided
        if (data.thumbnail) {
            // Only delete and upload a new thumbnail if the URL has changed
            if (data.thumbnail.url) {
                // Delete the existing thumbnail from Cloudinary
                await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);

                // Upload the new thumbnail to Cloudinary
                const uploadResult = await cloudinary.v2.uploader.upload(data.thumbnail.url, {
                    folder: "courses",
                });

                // Update the data object with the new thumbnail details
                data.thumbnail = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                };
            }
        }

        // Update the course in the database
        const course = await courseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true, runValidators: true }
        );

        // Handle case where the course is not found
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Invalidate the cached data for this course and all courses
        await redis.del(courseId);
        await redis.del("allCourses");

        // Send success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (err: any) {
        console.error("Error updating course:", err);
        return next(new ErrorHandler(err.message, 500));
    }
});

// Get a course by ID controller
export const getSingleCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        // Check if course data is cached in Redis
        const isCachedExist = await redis.get(courseId);
        if (isCachedExist) {
            const course = JSON.parse(isCachedExist);
            res.status(200).json({
                success: true,
                message: "Course found successfully",
                course,
            });
        } else {
            // Fetch the course from the database if not cached
            const course = await courseModel.findById(courseId)
                .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            // If the course is not found, return an error
            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            // Cache the course data in Redis
            await redis.set(courseId, JSON.stringify(course));

            // Send a success response with the course data
            res.status(200).json({
                success: true,
                message: "Course found successfully",
                course,
            });
        }
    } catch (err: any) {
        console.error("Error fetching course:", err);
        return next(new ErrorHandler(err.message, 500));
    }
});

// Controller to get all courses
export const getAllCourses = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if all courses data is cached in Redis
        const isCachedExist = await redis.get("allCourses");
        if (isCachedExist) {
            const courses = JSON.parse(isCachedExist);
            res.status(200).json({
                success: true,
                message: "Courses retrieved successfully",
                courses,
            });
        } else {
            // Fetch all courses from the database
            const courses = await courseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            // Check if any courses exist
            if (!courses || courses.length === 0) {
                return next(new ErrorHandler("No courses found", 404));
            }

            // Cache the courses data in Redis
            await redis.set("allCourses", JSON.stringify(courses));

            // Send the response with the list of courses
            res.status(200).json({
                success: true,
                message: "Courses retrieved successfully",
                courses,
            });
        }
    } catch (err: any) {
        console.error("Error retrieving courses:", err);
        return next(new ErrorHandler(err.message, 500));
    }
});

// Controller to delete a course by ID
export const deleteCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        // Find the course in the database
        const course = await courseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Delete the course's thumbnail from Cloudinary if it exists
        if (course.thumbnail && (course.thumbnail as any).public_id) {
            await cloudinary.v2.uploader.destroy((course.thumbnail as any).public_id);
        }

        // Delete the course from the database
        await courseModel.findByIdAndDelete(courseId);

        // Remove the course from Redis cache
        await redis.del(courseId);

        // Send a success response
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (err: any) {
        console.error("Error deleting course:", err);
        return next(new ErrorHandler(err.message, 500));
    }
});

// Get course content for only valid users
export const getCourseByUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Ensure that the user is authenticated and has a list of courses
        const user = req.user;
        if (!user || !user.courses) {
            return next(new ErrorHandler("User not authenticated or no courses found", 401));
        }

        const userCourseList = user.courses;

        // console.log(userCourseList)
        // Extract the course ID from the request parameters
        const courseId = req.params.id;

        // Check if the user is enrolled in the requested course
        const courseExist = userCourseList.find((course: any) => course._id.toString() === courseId);

        if (!courseExist) {
            return next(new ErrorHandler("You've not enrolled in any course yet", 403));
        }

        // Fetch the course details from the database
        const course = await courseModel.findById(courseId);

        // Handle case where the course is not found
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Extract the course content
        const content = course.courseData;

        // Send success response with the course content
        res.status(200).json({
            success: true,
            message: "Course retrieved successfully",
            content
        });

    } catch (err: any) {
        // Handle errors and pass them to the global error handler
        console.error("Error retrieving course for user:", err);
        return next(new ErrorHandler(err.message, 500));
    }
});

interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

// Controller to add a question to course content
export const addQuestion = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure and validate input data from the request body
        const { question, courseId, contentId }: IAddQuestionData = req.body;

        // Find the course by its ID
        const course = await courseModel.findById(courseId);

        // Validate the content ID to ensure it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        // Find the specific content within the course by ID
        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId))
        if (!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        // Create a new question object following the IComment interface structure
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }

        // Add the new question to the content's questions array
        courseContent.questions.push(newQuestion)

        await notificatioModel.create({
            user: req.user?._id,
            title: "New Question Recieved",
            message: `You have a new question in ${courseContent?.title}`
        })
        // Save the updated course document to the database
        await course?.save();
        // If the user has an email, send them a confirmation email
        if (req.user && req.user.email) {
            const data = {
                fullname: req.user.fullname,
                courseName: course?.name,
                question,
            };
            try {
                await sendEmail({
                    email: req.user.email,
                    subject: "Your Question Has Been Submitted",
                    template: "new-question.ejs",
                    data,
                });
            } catch (err: any) {
                console.error("Error sending email:", err);
                return next(new ErrorHandler("Failed to send email notification", 500));
            }
        }
        // Respond with success status and the updated course document
        res.status(200).json({
            success: true,
            message: "Question saved successfully",
            course
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
})

interface IAddQuestionReplyData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

// Controller to add an answer (reply) to a specific question in course content
export const addQuestionReply = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure and extract the necessary data from the request body
        const { answer, courseId, contentId, questionId }: IAddQuestionReplyData = req.body;

        // Validate the content ID to ensure it's a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content ID", 400));
        }

        // Find the course by its ID
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }


        // Find the specific content within the course by its ID
        const courseContent = course.courseData.find((item: any) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler("Content not found in the course", 404));
        }

        // Find the specific question within the content by its ID
        const question = courseContent.questions.find((item: any) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }

        // Create a new answer object to be added to the question's replies
        const newAnswer: any = {
            user: req.user,
            answer
        };

        // Add the new answer to the question's replies array
        question.questionReplies.push(newAnswer);

        // Save the updated course document to the database
        await course.save();

        await notificatioModel.create({
            user: req.user?._id,
            title: "New Question Reply",
            message: `You have a new question reply in ${courseContent?.title}`
        })

        // If the user replying is not the same as the user who asked the question
        if (req.user?._id !== question.user._id) {
            const data = { fullname: question.user.fullname, title: courseContent.title };
            try {
                await sendEmail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data
                });
            } catch (err: any) {
                return next(new ErrorHandler(err.message, 500));
            }
        }


        res.status(200).json({
            success: true,
            message: "Question Reply Submitted",
            course
        });

    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Interface to define the structure of the review data
interface IAddReviewData {
    comment: string;
    rating: number;
    userId: string;
}

// Add a Review
export const addReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the list of courses the user is enrolled in
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        // Check if the user is enrolled in the course they are trying to review
        const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId.toString());

        if (!courseExists) {
            return next(new ErrorHandler("You're not eligible to access this course", 404));
        }

        // Find the course by ID
        const course = await courseModel.findById(courseId);
        const { comment, rating } = req.body as IAddReviewData;

        // Prepare the review data to be added
        const reviewData: any = {
            user: req.user,
            comment,
            rating
        };

        // Add the new review to the course
        course?.reviews.push(reviewData);

        // Calculate the new average rating
        if (course) {
            const totalRating = course.reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
            course.ratings = totalRating / course.reviews.length;
        }

        await notificatioModel.create({
            user: req.user?._id,
            title: "New Review",
            message: `You have a new review in ${course?.name}`
        })

        // Save the updated course with the new review
        await course?.save();

        // Send a thank-you email to the user if they have an email address
        if (req.user && req.user.email) {
            const data = {
                fullname: req.user.fullname,
                courseName: course?.name,
                rating,
                comment,
            };

            try {
                await sendEmail({
                    email: req.user.email,
                    subject: "Thank you for your review!",
                    template: "new-review.ejs",
                    data
                });
            } catch (err: any) {
                console.error("Error sending email:", err);
                return next(new ErrorHandler("Failed to send email notification", 500));
            }
        }

        // Respond with success and the updated course
        res.status(200).json({
            success: true,
            message: "New Review Added successfully",
            course
        });
    } catch (err: any) {
        // Handle any errors that occur during the process
        return next(new ErrorHandler(err.message, 500));
    }
});

// adding a review reply
interface IReviewReplyData {
    comment: string
    courseId: string
    reviewId: string
}

// Controller to add a reply to a review and notify the reviewer via email
export const addReviewReply = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure the relevant data from the request body
        const { comment, courseId, reviewId } = req.body as IReviewReplyData;

        // Find the course by its ID
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course Not Found", 404));
        }

        // Find the specific review within the course by its ID
        const review = course.reviews?.find((rev: any) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler("Review Not Found", 404));
        }

        // Create the reply data object
        const replyData: any = {
            user: req.user,
            comment,
        };

        // Initialize commentReplies array if it doesn't exist and push the new reply
        review.commentReplies = review.commentReplies || [];
        review.commentReplies.push(replyData);

        // Save the updated course document to the database
        await course.save();

        // Send notification email to the original reviewer if they have an email address
        if (review.user?.email) {
            const data = {
                fullname: review.user.fullname,
                courseName: course.name,
                reviewComment: review.comment,
                replyComment: comment,
            };


            await notificatioModel.create({
                user: req.user?._id,
                title: "New Review",
                message: `You have a new review reply in ${course.name}`
            })

            try {
                await sendEmail({
                    email: review.user.email,
                    subject: "New Reply to Your Review!",
                    template: "review-reply.ejs",
                    data,
                });
            } catch (err: any) {
                console.error("Error sending email:", err);
                return next(new ErrorHandler("Failed to send email notification", 500));
            }
        }

        // Return a success response
        res.status(200).json({
            success: true,
            message: "Review Reply Added Successfully",
            course,
        });
    } catch (err: any) {
        // Handle any errors by passing them to your global error handler
        return next(new ErrorHandler(err.message, 500));
    }
});