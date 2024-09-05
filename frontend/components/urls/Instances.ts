import { auth, order, course, cart, analytics, layout } from "../../utils/Endpoints";
import { createApiInstance } from "./apis";

// Auth API instance
export const authApi = createApiInstance(auth);

// Order API instance
export const orderApi = createApiInstance(order);

// Course API instance
export const courseApi = createApiInstance(course);

// Cart API instance
export const cartApi = createApiInstance(cart);

// Analytics API instance
export const analyticsApi = createApiInstance(analytics);

// Layout API instance
export const layoutApi = createApiInstance(layout);
