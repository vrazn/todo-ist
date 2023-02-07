export class Todo {
  id!: number;
  title!: string;
  description!: string | null;
  isImportant!: boolean;
  isDone!: boolean;
  dueDate!: string | null;
}
