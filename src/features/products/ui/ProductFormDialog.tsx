import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery } from "@/entities/product";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@/entities/product";
import { X, Plus, Image as ImageIcon } from "lucide-react";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => void;
  isLoading: boolean;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: ProductFormDialogProps) {
  const { data: categories } = useGetCategoriesQuery();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    images: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        categoryId: product.category.id.toString(),
        images: product.images,
      });
    } else {
      setFormData({
        title: "",
        price: "",
        description: "",
        categoryId: "",
        images: [],
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      categoryId: Number(formData.categoryId),
      images:
        formData.images.length > 0
          ? formData.images
          : ["https://placehold.co/600x400"],
    };

    onSubmit(data);
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot yaratish"}
            </DialogTitle>
            <DialogDescription>
              {product
                ? "Bu yerda mahsulotga o'zgarishlar kiriting."
                : "Katalogingizga yangi mahsulot qo'shing."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Sarlavha</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Mahsulot sarlavhasi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Narx</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mahsulot tavsifi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategoriya</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, categoryId: value })
                }
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="images">Rasmlar</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="newImageUrl"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Rasm URL manzilini kiriting"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addImage())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImage}
                    disabled={!newImageUrl.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Qo'shilgan rasmlar ({formData.images.length}):
                    </Label>
                    <div className="grid gap-2 max-h-36 overflow-y-auto">
                      {formData.images.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                        >
                          <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate flex-1">
                            {imageUrl}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {formData.images.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Agar rasm qo'shmasangiz, o'rnib qo'yuvchi rasm ishlatiladi.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saqlanmoqda..."
                : product
                ? "O'zgarishlarni saqlash"
                : "Mahsulot yaratish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
