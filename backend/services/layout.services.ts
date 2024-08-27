import cloudinary from 'cloudinary';

// Helper function to upload image to Cloudinary
export const createBanner = async (data: any) => {
    const { image, title, subTitle } = data;
    const myCloud = await cloudinary.v2.uploader.upload(image, { folder: "layouts" });
    return {
        type: "Banner",
        banner: {
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            title,
            subTitle
        }
    };
};

// Helper function to create FAQ
export const createFAQ = (data: any) => ({
    type: "FAQ",
    faq: data.map((item: any) => ({
        question: item.question,
        answer: item.answer
    }))
});

// Helper function to create Categories
export const createCategories = (data: any) => ({
    type: "Categories",
    categories: data.map((item: any) => ({ title: item.title }))
});
