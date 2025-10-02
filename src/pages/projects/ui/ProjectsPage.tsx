import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type Product,
  type ProductsQueryParams,
  type CreateProductDto,
  type UpdateProductDto,
} from "@/entities/product";
import {
  ProductFilters,
  ProductCard,
  ProductFormDialog,
  Pagination,
} from "@/features/products";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProjectsPage() {
  const [filters, setFilters] = useState<ProductsQueryParams>({
    offset: 0,
    limit: 12,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetProductsQuery(filters);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleFilterChange = (newFilters: ProductsQueryParams) => {
    setFilters({ ...newFilters, offset: 0, limit: itemsPerPage });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters((prev) => ({
      ...prev,
      offset: (page - 1) * itemsPerPage,
    }));
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      offset: 0,
      limit: items,
    }));
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleFormSubmit = async (
    data: CreateProductDto | UpdateProductDto
  ) => {
    try {
      if (selectedProduct) {
        await updateProduct({
          id: selectedProduct.id,
          data: data as UpdateProductDto,
        }).unwrap();
      } else {
        await createProduct(data as CreateProductDto).unwrap();
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const totalItems = 50; // API returns 50 products

  return (
    <div className="min-h-screen">
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mahsulotlar</h1>
          </div>
          <Button onClick={handleCreateProduct}>
            <Plus className="h-4 w-4" />
            Qo'shish
          </Button>
        </div>

        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="relative">
              {isFetching && (
                <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              <div className="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              Mahsulotlar topilmadi
            </p>
            <Button onClick={handleCreateProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Birinchi mahsulotingizni qo'shing
            </Button>
          </div>
        )}
      </main>

      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mahsulotni o'chirish</DialogTitle>
            <DialogDescription>
              Bu mahsulotni o'chirishga ishonchingiz komilmi? Bu amalni qaytarib
              bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="text-white"
            >
              {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
