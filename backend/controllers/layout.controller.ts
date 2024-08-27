import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary"
import layoutModel from "../model/layout.model";
import { createBanner, createCategories, createFAQ } from "../services/layout.services";
import { redis } from "../utils/redis";
import { setCache } from "../utils/catche.management";

// Create Layout
export const createLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;

    const isTypeExist = await layoutModel.findOne({ type });
    if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400));
    }

    let layoutData;
    switch (type) {
        case "Banner":
            layoutData = await createBanner(req.body);
            break;
        case "FAQ":
            layoutData = createFAQ(req.body.faqData);
            break;
        case "Categories":
            layoutData = createCategories(req.body.categoriesData);
            break;
        default:
            return next(new ErrorHandler("Invalid layout type", 400));
    }

    await layoutModel.create(layoutData);

    res.status(201).json({
        success: true,
        message: "Layout created successfully"
    });
});

// Get All Layouts
export const getAllLayouts = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const layouts = await layoutModel.find();
    if (!layouts.length) {
        return next(new ErrorHandler("No layouts found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Layouts retrieved successfully",
        layouts
    });
});


// Update Layout by ID
export const editLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;

    let updatedLayout;
    switch (type) {
        case "Banner":
            const existingBanner = await layoutModel.findOne({ type: "Banner" });
            if (existingBanner?.banner?.image?.public_id) {
                await cloudinary.v2.uploader.destroy(existingBanner.banner.image.public_id);
            }
            updatedLayout = await createBanner(req.body);
            await layoutModel.findByIdAndUpdate(existingBanner?._id, updatedLayout);
            break;
        case "FAQ":
            const existingFAQ = await layoutModel.findOne({ type: "FAQ" });
            updatedLayout = createFAQ(req.body.faqData);
            await layoutModel.findByIdAndUpdate(existingFAQ?._id, updatedLayout);
            break;
        case "Categories":
            const existingCategories = await layoutModel.findOne({ type: "Categories" });
            updatedLayout = createCategories(req.body.categoriesData);
            await layoutModel.findByIdAndUpdate(existingCategories?._id, updatedLayout);
            break;
        default:
            return next(new ErrorHandler("Invalid layout type", 400));
    }

    res.status(200).json({
        success: true,
        message: "Layout updated successfully"
    });
});


// Delete Layout by ID
export const deleteLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const layout = await layoutModel.findById(id);
    if (!layout) {
        return next(new ErrorHandler("Layout not found", 404));
    }

    if (layout.banner?.image?.public_id) {
        await cloudinary.v2.uploader.destroy(layout.banner.image.public_id);
    }

    await layoutModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Layout deleted successfully"
    });
});


// Get Layout by Type
export const getLayoutByType = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;

        const layout = await layoutModel.findOne({ type });
        if (!layout) {
            return next(new ErrorHandler(`No layout found for type: ${type}`, 404));
        }

        // Cache the layout configuration with an expiration
        await setCache(`layout_${type}`, layout, 86400); 

        res.status(200).json({
            success: true,
            message: `${type} layout retrieved successfully`,
            layout
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});