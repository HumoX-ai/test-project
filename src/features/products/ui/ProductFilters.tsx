import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useGetCategoriesQuery } from "@/entities/product";
import type { ProductsQueryParams } from "@/entities/product";
import { Filter, X } from "lucide-react";

interface ProductFiltersProps {
  filters: ProductsQueryParams;
  onFilterChange: (filters: ProductsQueryParams) => void;
}

export function ProductFilters({
  filters,
  onFilterChange,
}: ProductFiltersProps) {
  const { data: categories } = useGetCategoriesQuery();
  const [localFilters, setLocalFilters] =
    useState<ProductsQueryParams>(filters);

  const handleInputChange = (
    field: keyof ProductsQueryParams,
    value: string
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleNumberChange = (
    field: keyof ProductsQueryParams,
    value: string | undefined
  ) => {
    const numValue =
      value === "" || value === undefined ? undefined : Number(value);
    setLocalFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetFilters: ProductsQueryParams = {
      offset: 0,
      limit: 12,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    localFilters.title ||
    localFilters.price !== undefined ||
    localFilters.price_min !== undefined ||
    localFilters.price_max !== undefined ||
    localFilters.categoryId !== undefined;

  return (
    <div className="mb-6">
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto mb-4">
            <Filter className="mr-2 h-4 w-4" />
            Filtrlarni ko'rsatish
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                Faol
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-80 sm:w-96">
          <DrawerHeader>
            <DrawerTitle>Mahsulot filtrlari</DrawerTitle>
            <DrawerDescription>
              Mahsulotlarni turli mezonlar bo'yicha filtrlash
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Sarlavha bo'yicha qidirish</Label>
                <Input
                  id="title"
                  placeholder="Sarlavha kiriting..."
                  value={localFilters.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategoriya</Label>
                <Select
                  value={localFilters.categoryId?.toString() || "all"}
                  onValueChange={(value: string) =>
                    handleNumberChange(
                      "categoryId",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_min">Minimal narx</Label>
                <Input
                  id="price_min"
                  type="number"
                  placeholder="0"
                  value={localFilters.price_min || ""}
                  onChange={(e) =>
                    handleNumberChange("price_min", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_max">Maksimal narx</Label>
                <Input
                  id="price_max"
                  type="number"
                  placeholder="10000"
                  value={localFilters.price_max || ""}
                  onChange={(e) =>
                    handleNumberChange("price_max", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
            <DrawerFooter>
            <div className="flex flex-col gap-3 sm:flex-row">
              <DrawerClose asChild>
              <Button onClick={applyFilters} className="flex-1">
                Filtrlarni qo'llash
              </Button>
              </DrawerClose>
              <Button
              variant="outline"
              onClick={resetFilters}
              className="flex-1"
              >
              <X className="mr-2 h-4 w-4" />
              Qayta tiklash
              </Button>
            </div>
            </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
