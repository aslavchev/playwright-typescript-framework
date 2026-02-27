/** Get Single product from DummyJSON.  */
export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
}

/** Get All products list from DummyJSON.  */
export interface ProductListResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

/** Delete product from DummyJSON.  */
export interface DeleteProductResponse extends Product {
    isDeleted: boolean;
    deletedOn: string;
}