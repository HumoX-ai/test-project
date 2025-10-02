export { productsApi } from "./api/productsApi";
export {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} from "./api/productsApi";
export type {
  Product,
  Category,
  CreateProductDto,
  UpdateProductDto,
  ProductsQueryParams,
} from "./model/types";
