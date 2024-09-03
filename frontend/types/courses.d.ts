interface AvatarType {
    public_id: string;
    url: string;
}

type UserType = {
    id: string;
    fullname: string;
    email: string;
    avatar?: AvatarType;
};

type CommentType = {
    user: UserType;
    question: string;
    questionReplies: CommentType[];
}

type ReviewType = {
    user: UserType;
    rating?: number;
    comment: string;
    commentReplies?: CommentType[];
}

type LinkType = {
    title: string;
    url: string;
}

type BenefitType = {
    _id: string;
    title: string;
}

type PrerequisitesType = {
    _id: string;
    title: string;
}

type CourseDataType = {
    _id: string;
    title: string;
    description: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
}

type ThumbnailType = {
    public_id: string;
    url: string;
}


type CartItemType = {
    _id: string;
    courseId: CoursesType;  
    quantity: number;
  };

  
type CoursesType = {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: ThumbnailType;
    tags: string[];
    level: string;
    demoUrl: string;
    benefits: BenefitType[];
    prerequisites: PrerequisitesType[];
    reviews: ReviewType[];
    courseData: CourseDataType[];
    ratings?: number;
    purchased?: number;
}
