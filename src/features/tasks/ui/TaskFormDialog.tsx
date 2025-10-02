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
import { taskManager, type Task, type TaskStatus } from "@/lib/taskManager";
import { useGetProductsQuery } from "@/entities/product";
import { Trash2 } from "lucide-react";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: TaskFormDialogProps) {
  const { data: productsData } = useGetProductsQuery({ limit: 100 });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    projectId: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        projectId: task.projectId?.toString() || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        projectId: "",
      });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (task) {
        taskManager.updateTask(task.id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          projectId: formData.projectId
            ? Number(formData.projectId)
            : undefined,
        });
      } else {
        taskManager.addTask({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          projectId: formData.projectId
            ? Number(formData.projectId)
            : undefined,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (confirm("Rostdan ham bu vazifani o'chirmoqchimisiz?")) {
      setIsLoading(true);
      try {
        taskManager.deleteTask(task.id);
        onOpenChange(false);
      } catch (error) {
        console.error("O'chirishda xatolik:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {task ? "Vazifani tahrirlash" : "Yangi vazifa yaratish"}
            </DialogTitle>
            <DialogDescription>
              {task
                ? "Bu yerda vazifaga o'zgarishlar kiriting."
                : "Yangi vazifa qo'shing."}
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
                placeholder="Vazifa sarlavhasi"
                required
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
                placeholder="Vazifa tavsifi"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Holat</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) =>
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Loyiha</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, projectId: value })
                }
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Loyihani tanlang (ixtiyoriy)" />
                </SelectTrigger>
                <SelectContent>
                  {productsData?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            {task && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                O'chirish
              </Button>
            )}
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
                : task
                ? "O'zgarishlarni saqlash"
                : "Vazifa yaratish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
