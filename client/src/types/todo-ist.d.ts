declare module 'todo-list' {
  export interface ITodo {
    id: number;
    title: string;
    description: string | null;
    isImportant: boolean;
    isDone: boolean;
    /** ISO8601 date only string */
    dueDate: string | null;
  }

  export interface ITodoCreationAttributes {
    title: string;
    description?: string | null;
    isImportant?: boolean;
    isDone?: boolean;
    /** ISO8601 date only string */
    dueDate?: string | null;
  }

  export interface ITodoUpdateAttributes
    extends Pick<ITodo, 'id'>,
      Partial<ITodoCreationAttributes> {}

  export interface ITodoDeleteAttributes extends Pick<ITodo, 'id'> {}
}
