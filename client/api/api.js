const BASE_URL = 'http://localhost:5000'

const APIS = {
    "LOGIN": `${BASE_URL}/api/auth/login`,
    "REGISTER": `${BASE_URL}/api/auth/register`,
    "PRODUCTS": `${BASE_URL}/api/products`,
    "PRODUCTS_TOP": `${BASE_URL}/api/products/top-category`
}

export default APIS;