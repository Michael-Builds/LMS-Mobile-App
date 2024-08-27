import mongoose, { Schema, Model, Document } from "mongoose";

interface FAQItem {
    question: string;
    answer: string;
}

interface Category {
    title: string;
}

interface Banner {
    image: BannerImage;
    title: string;
    subTitle: string;
}

interface BannerImage {
    public_id: string;
    url: string;
}

interface Layout extends Document {
    type: string;
    faq?: FAQItem[];
    categories?: Category[];
    banner?: Banner;
}

const faqSchema = new Schema<FAQItem>({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
});

const categorySchema = new Schema<Category>({
    title: {
        type: String,
        required: true
    },
});

const bannerImageSchema = new Schema<BannerImage>({
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
});

const bannerSchema = new Schema<Banner>({
    image: {
        type: bannerImageSchema,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
});

const layoutSchema = new Schema<Layout>({
    type: {
        type: String,
        required: true,
        enum: ["Banner", "FAQ", "Categories"]
    },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: bannerSchema,
});

const layoutModel: Model<Layout> = mongoose.model<Layout>("Layout", layoutSchema);

export default layoutModel;
