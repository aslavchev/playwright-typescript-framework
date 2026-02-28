import { test, expect } from '../../src/api/fixtures';
import { Endpoints } from '../../src/api/data/endpoints';
import { Pagination, NewProduct, UpdateProduct, EXISTING_PRODUCT_ID, MUTABLE_PRODUCT_ID, INVALID_PRODUCT_ID } from '../../src/api/data/test-data';
import { ProductListResponse, Product, DeleteProductResponse } from '../../src/api/types/product.types';

test.describe('Products API', () => {
    test('[TC-PRODUCT-001] Get all products return default pagination @smoke @api', async ({ request }) => {
        // Act
        const response = await request.get(Endpoints.PRODUCTS);
        const body: ProductListResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.products.length).toBe(Pagination.DEFAULT_LIMIT);
        expect(body.total).toBeGreaterThan(0);
        expect(body.skip).toBe(0);
        expect(body.limit).toBe(Pagination.DEFAULT_LIMIT);
    });

    test('[TC-PRODUCT-002] Get product by id returns product details @smoke @api', async ({ request }) => {
        // Act
        const response = await request.get(`${Endpoints.PRODUCTS}/${EXISTING_PRODUCT_ID}`);
        const body: Product = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.id).toEqual(EXISTING_PRODUCT_ID);
        expect(body.title).toBeTruthy();
    });

    test('[TC-PRODUCT-003] GET product by invalid ID returns 404 @regression @api', async ({ request }) => {
        // Act
        const response = await request.get(`${Endpoints.PRODUCTS}/${INVALID_PRODUCT_ID}`);
        const body = await response.json();

        // Assert
        expect(response.status()).toBe(404);
        expect(body.message).toContain('not found');
    });

    test('[TC-PRODUCT-004] Search products returns matching results @smoke @api', async ({ request }) => {
        // Act
        const response = await request.get(`${Endpoints.PRODUCTS}/search?q=laptop`);
        const body: ProductListResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.products.length).toBeGreaterThan(0);
        expect(body.total).toBeGreaterThan(0);
        expect(body.products[0].category).toBe('laptops');
    });

    test('[TC-PRODUCT-005] Search non-existent product returns empty results @regression @api', async ({ request }) => {
        // Act
        const response = await request.get(`${Endpoints.PRODUCTS}/search?q=nonexistentproduct12345`);
        const body: ProductListResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.products.length).toBe(0);
        expect(body.total).toBe(0);
    });

    test('[TC-PRODUCT-006] POST add product returns 201 @smoke @api', async ({ request, authToken }) => {
        // Act
        const response = await request.post(`${Endpoints.PRODUCTS}/add`, {
            data: NewProduct,
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const body: Product = await response.json();

        // Assert
        expect(response.status()).toBe(201);
        expect(body.id).toBeGreaterThan(0);
        expect(body.title).toBe(NewProduct.title);
    });

    test('[TC-PRODUCT-007] PUT update product returns updated product @smoke @api', async ({ request, authToken }) => {
        // Act
        const response = await request.put(`${Endpoints.PRODUCTS}/${MUTABLE_PRODUCT_ID}`, {
            data: UpdateProduct,
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const body: Product = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.id).toBe(MUTABLE_PRODUCT_ID);
        expect(body.title).toBe(UpdateProduct.title);
    });

    test('[TC-PRODUCT-008] DELETE product returns soft-deleted product @smoke @api', async ({ request, authToken }) => {
        // Act
        const response = await request.delete(`${Endpoints.PRODUCTS}/${MUTABLE_PRODUCT_ID}`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const body: DeleteProductResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.id).toBe(MUTABLE_PRODUCT_ID);
        expect(body.isDeleted).toBe(true);
    });

    const paginationData = [
        { limit: 5, skip: 0, expectedSize: 5, expectedLimit: 5, label: 'first page' },
        { limit: 5, skip: 10, expectedSize: 5, expectedLimit: 5, label: 'middle page' },
        { limit: 5, skip: 9999, expectedSize: 0, expectedLimit: 0, label: 'beyond total' },
    ];
    for (const { limit, skip, expectedSize, expectedLimit, label } of paginationData) {
        test(`[TC-PRODUCT-009] GET products pagination ${label} @regression @api`, async ({ request }) => {
            // Act
            const response = await request.get(`${Endpoints.PRODUCTS}?limit=${limit}&skip=${skip}`);
            const body: ProductListResponse = await response.json();

            // Assert
            expect(response.status()).toBe(200);
            expect(body.products.length).toBe(expectedSize);
            expect(body.skip).toBe(skip);
            expect(body.limit).toBe(expectedLimit);
        });
    }
});