import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductsQueryParams,
  Category,
} from "../model/types";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PRODUCTS_API_BASE_URL,
  }),
  tagTypes: ["Product", "Category"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              searchParams.append(key, String(value));
            }
          });
        }
        const queryString = searchParams.toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} = productsApi;
