import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: number;
    totalPurchases?: number;
    totalRevenue?: number;
    totalSum?: number;  // Added this line
}

interface GenerateLast12MonthsDataOptions<T extends Document> {
    model: Model<T>;
    purchaseField?: keyof T;
    revenueField?: keyof T;
    sumField?: keyof T;
}

export async function generateLast12MonthsData<T extends Document>(
    options: GenerateLast12MonthsDataOptions<T>
): Promise<{ last12Months: MonthData[] }> {
    const { model, purchaseField, revenueField, sumField } = options;
    const last12Months: MonthData[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

        const monthYear = startDate.toLocaleString("default", { month: "short", year: "numeric" });

        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });

        let totalPurchases: number | undefined = undefined;
        let totalRevenue: number | undefined = undefined;
        let totalSum: number | undefined = undefined;

        if (purchaseField) {
            const purchaseAggregation = await model.aggregate([
                { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
                { $group: { _id: null, total: { $sum: `$${String(purchaseField)}` } } }
            ]);
            totalPurchases = purchaseAggregation[0]?.total || 0;
        }

        if (revenueField) {
            const revenueAggregation = await model.aggregate([
                { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
                { $group: { _id: null, total: { $sum: `$${String(revenueField)}` } } }
            ]);
            totalRevenue = revenueAggregation[0]?.total || 0;
        }

        if (sumField) {
            const sumAggregation = await model.aggregate([
                { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
                { $group: { _id: null, total: { $sum: `$${String(sumField)}` } } }
            ]);
            totalSum = sumAggregation[0]?.total || 0;
        }

        last12Months.push({ 
            month: monthYear, 
            count, 
            totalPurchases, 
            totalRevenue,
            totalSum
        });
    }

    return { last12Months };
}