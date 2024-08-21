import notificatioModel from "../model/notification.model";
import cron from "node-cron"
import sendEmail from "../utils/sendEmail";
import userModel from "../model/user.model";
import deactivatedModel from "../model/deactivate.model";



// Cron job to delete notifications older than 30 days
cron.schedule("0 0 * * *", async () => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await notificatioModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
        console.log("Deleted all read notifications older than 30 days");
    } catch (error) {
        console.error("Error deleting notifications:", error);
    }
});



// Cron job to deactivate user accounts
// Runs every 30 minutes to check if any users' deactivation dates have passed
cron.schedule("*/30 * * * *", async () => {
    try {
        const now = new Date();

        // Find users whose deactivation date has passed
        const usersToDeactivate = await userModel.find({
            deactivationDate: { $lt: now },
            hasRequestedDeactivation: true
        });

        for (const user of usersToDeactivate) {
            // Move user to the deactivated users collection
            const deactivatedUser = new deactivatedModel({
                fullname: user.fullname,
                email: user.email,
                avatar: user.avatar,
                deactivatedAt: now,
                isVerified: user.isVerified,
            });

            await deactivatedUser.save();

            // Create a notification for account deactivation
            await notificatioModel.create({
                user: user._id,
                title: "Account Deactivated",
                message: `Account for ${user.fullname} has been deactivated`,
            });

            // Send an email notification to the user
            await sendEmail({
                email: user.email,
                subject: "Account Deactivated",
                template: "account-deactivated.ejs",
                data: {
                    fullname: user.fullname,
                },
            });

            // Delete the user from the main users collection
            await userModel.findByIdAndDelete(user._id);

            console.log(`User ${user.email} has been deactivated.`);
        }
    } catch (error) {
        console.error("Error in account deactivation process:", error);
    }
});
