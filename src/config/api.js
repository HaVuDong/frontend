const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337/api',
    APP_KEY: process.env.NEXT_PUBLIC_APP_KEY || "",
    IMAGE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:1337',
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
};
export default API_CONFIG;