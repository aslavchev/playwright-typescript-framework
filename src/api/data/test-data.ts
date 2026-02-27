/** Test data for DummyJSON API tests. */
export const ApiUsers = {
    VALID: {
        username: process.env.DUMMYJSON_USERNAME ?? 'emilys',
        password: process.env.DUMMYJSON_PASSWORD ?? 'emilyspass',
    },
    INVALID: {
        username: 'nonexistent',
        password: 'wrongpass',
    }
} as const;

export const NewProduct = {
    title: 'Playwright Test Product',
    price: 42.99,
    category: 'test-automation',
} as const;

export const Pagination = {
    DEFAULT_LIMIT: 30,
    CUSTOM_LIMIT: 5,
    CUSTOM_SKIP: 10,
} as const;

/** Known product ID in DummyJSON for GET/DELETE tests. */
export const EXISTING_PRODUCT_ID = 1;