import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { taskManager, type Task, type TaskStatus } from "@/lib/taskManager";
import { useGetProductsQuery } from "@/entities/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical } from "lucide-react";
import { TaskFormDialog } from "@/features/tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function SortableTask({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onEdit(task)}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <div className="mt-1 text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm break-words">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 break-words">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DroppableColumn({
  column,
  tasks,
  onEdit,
}: {
  column: { id: string; title: string; color: string };
  tasks: Task[];
  onEdit: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col h-full">
      <Card className={column.color}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{column.title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {tasks.length}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <SortableContext
        items={tasks.map((t) => t.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`space-y-2 min-h-[300px] p-2 rounded-lg transition-colors flex-1 ${
            isOver ? "bg-muted" : "bg-muted/20"
          }`}
        >
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onEdit={onEdit} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8 flex-1 flex items-center justify-center">
              Bu ustunda vazifa yo'q
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function TasksPage() {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { data: productsData } = useGetProductsQuery({ limit: 100 });

  useEffect(() => {
    // Subscribe to task manager updates
    const unsubscribe = taskManager.subscribe(setTasks);
    // Initialize with current tasks
    setTasks(taskManager.getTasks());
    return unsubscribe;
  }, []);

  // Loyihaga qarab tasklarni filterlash
  const filteredTasks =
    selectedProject === "all"
      ? tasks
      : tasks.filter((task) => task.projectId?.toString() === selectedProject);

  // Statusga qarab tasklarni guruhlash va tartiblash
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: filteredTasks
      .filter((t) => t.status === "todo")
      .sort((a, b) => a.order - b.order),
    "in-progress": filteredTasks
      .filter((t) => t.status === "in-progress")
      .sort((a, b) => a.order - b.order),
    done: filteredTasks
      .filter((t) => t.status === "done")
      .sort((a, b) => a.order - b.order),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = parseInt(event.active.id.toString());
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = parseInt(active.id.toString());
    const overId = over.id.toString();

    // Check if dropping on a column (cross-column move)
    const destinationColumn = columns.find((col) => col.id === overId);
    if (destinationColumn) {
      // Moving to a different column
      const currentTask = tasks.find((t) => t.id === taskId);
      if (currentTask && currentTask.status !== destinationColumn.id) {
        taskManager.moveTask(taskId, destinationColumn.id as TaskStatus);
      }
      return;
    }

    // Check if dropping on another task (reordering within column)
    const overTaskId = parseInt(overId);
    if (!isNaN(overTaskId) && overTaskId !== taskId) {
      const activeTask = tasks.find((t) => t.id === taskId);
      const overTask = tasks.find((t) => t.id === overTaskId);

      if (activeTask && overTask && activeTask.status === overTask.status) {
        // Both tasks are in the same column, reorder them
        const columnTasks = tasksByStatus[activeTask.status];
        const activeIndex = columnTasks.findIndex((t) => t.id === taskId);
        const overIndex = columnTasks.findIndex((t) => t.id === overTaskId);

        if (activeIndex !== -1 && overIndex !== -1) {
          // Reorder the tasks array
          const reorderedTasks = [...columnTasks];
          const [removed] = reorderedTasks.splice(activeIndex, 1);
          reorderedTasks.splice(overIndex, 0, removed);

          // Update the order property for all tasks in this column
          const taskIds = reorderedTasks.map((t) => t.id);
          taskManager.reorderTasks(activeTask.status, taskIds);
        }
      }
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
  ];

  return (
    <div className="container mx-auto py-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Vazifalar</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="space-y-2">
            <Label htmlFor="project-filter">Loyiha</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger
                id="project-filter"
                className="w-full sm:w-[200px]"
              >
                <SelectValue placeholder="Barcha loyihalar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha loyihalar</SelectItem>
                {productsData?.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateTask} className="self-end">
            <Plus className="h-4 w-4 mr-2" />
            Yangi vazifa
          </Button>
        </div>
      </div>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id as TaskStatus]}
              onEdit={handleEditTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <Card className="shadow-lg opacity-90">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="mt-1 text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm break-words">
                      {activeTask.title}
                    </p>
                    {activeTask.description && (
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        {activeTask.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
      />
    </div>
  );
}
