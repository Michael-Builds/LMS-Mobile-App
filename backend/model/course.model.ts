import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IThumbnail {
    public_id: string;
    url: string;
}

interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies: IComment[];
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies?: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

export interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: IThumbnail;
    tags: string[];
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
    category: string;
}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentReplies: [Object],
});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String
})

const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
});

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema]
})

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    estimatedPrice: {
        type: Number
    },
    thumbnail: {
        public_id: {
            required: false,
            type: String
        },
        url: {
            required: false,
            type: String
        }
    },
    tags: {
        type: [String],
        required: true,

    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true })

const courseModel: Model<ICourse> = mongoose.model("Course", courseSchema)
export default courseModel