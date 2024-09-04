export const domain = process.env.NODE_ENV === 'production' ? "www.lms.com" : "http://192.168.1.110:4000"

export const auth = `${domain}/auth/api`;
export const order = `${domain}/order/api`;
export const course = `${domain}/courses/api`;
export const cart = `${domain}/cart/api`;
export const analytics = `${domain}/analytics/api`;
export const layout = `${domain}/layout/api`;
