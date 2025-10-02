import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/entities/product";
import { Edit, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full py-0">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0] || "https://placehold.co/600x400"}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
              {product.title}
            </h3>
            <span className="text-base sm:text-lg font-bold text-primary ml-2">
              ${product.price}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {product.category.name}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Tahrirlash</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm text-white"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">O'chirish</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
