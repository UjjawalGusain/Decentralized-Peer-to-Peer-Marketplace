const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://decentralized-peer-to-peer-marketpl.vercel.app";

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
    PAYMENTS_UPDATE_BY_BUYER: `${BASE_URL}/payments/update-by-buyer`,
    PAYMENTS_UPDATE_BY_SELLER: `${BASE_URL}/payments/update-by-seller`,
    PAYMENTS_GET: `${BASE_URL}/payments`, // Expect /payments/:razorpayOrderId appended when used
    PAYMENTS_LIST: `${BASE_URL}/payments`,

    // Payout APIs
    PAYOUTS_CREATE: `${BASE_URL}/payouts/create`,
    PAYOUTS_STATUS: `${BASE_URL}/payouts/status`,
    PAYOUTS_GET: `${BASE_URL}/payouts`, // expect sellerId and status to be appended

    PRODUCT_BY_SELLER: `${BASE_URL}/api/products/product-by-seller`, // Expect /:sellerId&:status appended
    ORDER_BY_SELLER: `${BASE_URL}/orders/orders-by-seller`, // Expect /:sellerId appended
    ORDER_BY_BUYER: `${BASE_URL}/orders/orders-by-buyer`, 
};

export default APIS;
