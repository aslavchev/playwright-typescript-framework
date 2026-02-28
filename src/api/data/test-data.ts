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

export const UpdateProduct = {
    title: 'Updated Title',
} as const;

export const MUTABLE_PRODUCT_ID = 1;

export const Pagination = {
    DEFAULT_LIMIT: 30,
} as const;

/** Known product ID in DummyJSON for read-only GET tests. */
export const EXISTING_PRODUCT_ID = 18;

/** Non-existent product ID for 404 tests. */
export const INVALID_PRODUCT_ID = 99999;
