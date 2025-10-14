const BASE_URL = "http://localhost:5000";

const APIS = {
    LOGIN: `${BASE_URL}/api/auth/login`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    PRODUCTS: `${BASE_URL}/api/products`,
    PRODUCTS_TOP: `${BASE_URL}/api/products/top-category`,
    USERS: `${BASE_URL}/users`,

    ORDERS_CREATE: `${BASE_URL}/orders/create`,

    PAYMENTS_ADD: `${BASE_URL}/payments/add`,
    PAYMENTS_VERIFY: `${BASE_URL}/payments/verify`,
    PAYMENTS_UPDATE: `${BASE_URL}/payments/update`,
    PAYMENTS_GET: `${BASE_URL}/payments`, // Expect /payments/:razorpayOrderId appended when used
    PAYMENTS_LIST: `${BASE_URL}/payments`,

    // Payout APIs
    PAYOUTS_CREATE: `${BASE_URL}/payouts/create`,
    PAYOUTS_STATUS: `${BASE_URL}/payouts/status`,
};

export default APIS;
