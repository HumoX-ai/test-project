export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface UpdateProductDto {
  title?: string;
  price?: number;
  description?: string;
  categoryId?: number;
  images?: string[];
}

export interface ProductsQueryParams {
  offset?: number;
  limit?: number;
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  categorySlug?: string;
}
