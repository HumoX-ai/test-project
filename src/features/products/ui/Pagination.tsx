import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
          Sahifadagi elementlar:
        </span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value: string) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[80px] sm:w-[70px] h-8 sm:h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <span className="text-xs sm:text-sm text-muted-foreground">
          {startItem}-{endItem} dan {totalItems}
        </span>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-1">Oldingi</span>
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3"
          >
            <span className="hidden sm:inline mr-1">Keyingi</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
