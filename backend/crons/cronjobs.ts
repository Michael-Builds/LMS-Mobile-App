import notificatioModel from "../model/notification.model";
import cron from "node-cron"
import sendEmail from "../utils/sendEmail";
import userModel from "../model/user.model";
import deactivatedModel from "../model/deactivate.model";
import cartModel from "../model/cart.model";


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

// Cron job to detect abandoned carts
cron.schedule('0 0 * * *', async () => {
    try {
        const cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        // Find carts that haven't been updated in the last 7 days
        const abandonedCarts = await cartModel.find({
            updatedAt: { $lt: cutoffTime },
        });

        for (const cart of abandonedCarts) {
            const user = await userModel.findById(cart.userId);
            if (user) {
                await sendEmail({
                    email: user.email,
                    subject: "You left something in your cart!",
                    template: "abandoned-cart-email.ejs",
                    data: { cart },
                });
                console.log(`Abandoned cart email sent to ${user.email}`);
            }
        }
    } catch (error) {
        console.error('Error detecting abandoned carts:', error);
    }
});


// Cron job to delete carts that haven't been updated in 2 months
cron.schedule('0 0 * * *', async () => {
    try {
        const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago (2 months)

        // Find and delete carts that haven't been updated in the last 2 months
        const deletedCarts = await cartModel.deleteMany({
            updatedAt: { $lt: twoMonthsAgo },
        });

        console.log(`Deleted ${deletedCarts.deletedCount} carts that were inactive for more than 2 months.`);
    } catch (error) {
        console.error('Error deleting old carts:', error);
    }
});


// Cron job to unlock user accounts after 24 hours
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();

        // Find and unlock users whose lock period has expired
        const usersToUnlock = await userModel.updateMany(
            { lockUntil: { $lt: now } },
            { $set: { lockUntil: null, loginAttempts: 0 } }
        );

        if (usersToUnlock.modifiedCount > 0) {
            console.log(`Unlocked ${usersToUnlock.modifiedCount} users after 24 hours.`);
        }
    } catch (error) {
        console.error('Error unlocking user accounts:', error);
    }
});


// Cron job to suspend user accounts after repeated failed login attempts
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();

        // Find users who have failed login attempts 3 times within 24 hours and failed again after lock
        const usersToSuspend = await userModel.find({
            failedLoginTimestamps: { $exists: true, $ne: [] }
        });

        for (const user of usersToSuspend) {
            // Filter timestamps within the last 24 hours
            const recentFailedAttempts = user.failedLoginTimestamps.filter(
                (timestamp) => now.getTime() - timestamp.getTime() <= 24 * 60 * 60 * 1000
            );

            // Suspend user if they failed 3 times within 24 hours and have a lockUntil set
            if (recentFailedAttempts.length >= 3 && user.lockUntil && user.lockUntil <= now) {
                // Move user to the deactivated users collection with a suspension reason
                const deactivatedUser = new deactivatedModel({
                    fullname: user.fullname,
                    email: user.email,
                    avatar: user.avatar,
                    deactivatedAt: now,
                    isVerified: user.isVerified,
                    reason: "Suspended due to multiple failed login attempts",
                });

                await deactivatedUser.save();

                // Delete the user from the main users collection
                await userModel.findByIdAndDelete(user._id);

                // Create a notification for the account suspension
                await notificatioModel.create({
                    user: user._id,
                    title: "Account Suspended",
                    message: "Your account has been suspended due to multiple failed login attempts."
                });

                // Send email notification to the user
                await sendEmail({
                    email: user.email,
                    subject: "Account Suspension Notification",
                    template: "many-failed-attempts.ejs",
                    data: {
                        fullname: user.fullname,
                    },
                });

                console.log(`User ${user.email} has been suspended.`);
            }
        }
    } catch (error) {
        console.error('Error suspending user accounts:', error);
    }
});

cron.schedule('*/2 * * * * *', () => {
    console.log('------ Running cron ------');
});
