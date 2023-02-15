import React, { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton, message, Spin } from 'antd';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import orderBy from 'lodash/orderBy';
import dayjs from 'dayjs';

const Result = dynamic(() => import('antd/lib/result'), {
  ssr: false,
  loading: () => <Spin />,
});
const Empty = dynamic(() => import('antd/lib/empty'), {
  ssr: false,
  loading: () => <Spin />,
});

import {
  useGetTodos,
  usePatchTodo,
  useDeleteTodo,
} from '@/components/hooks/todos';
import { TodoItem } from '@/components/atoms/TodoItem';

import styles from './styles.module.css';

import type { ITodo } from 'todo-list';

interface ITodoListProps {
  filter: 'all' | 'today' | 'important' | 'uncompleted' | 'completed';
  onEdit: (todo: ITodo) => void;
}

const Placeholder = Array.from({ length: 10 }).map((_, index) => (
  <Skeleton key={`skeleton-${index}`} />
));

export const List: React.FC<ITodoListProps> = ({ filter, onEdit }) => {
  const { todos, isLoading, error: getError } = useGetTodos();
  const { trigger: update } = usePatchTodo();
  const { trigger: remove } = useDeleteTodo();

  const toggleDone = useCallback(
    async (todo: ITodo) => {
      try {
        await update({ id: todo.id, isDone: !todo.isDone });
      } catch (e) {
        message.error('Something went wrong!');
      }
    },
    [update],
  );

  const data = useMemo(() => {
    if (!todos) return;

    const order = [
      ['isDone', 'dueDate', 'isImportant', 'id'],
      ['asc', 'asc', 'desc', 'desc'],
    ];

    switch (filter) {
      case 'all':
        return orderBy(todos, ...order);
      case 'today':
        return orderBy(
          todos.filter(
            (o) => o.dueDate != null && dayjs().isSame(o.dueDate, 'date'),
          ),
          ...order,
        );
      case 'important':
        return orderBy(
          todos.filter((o) => o.isImportant),
          ...order,
        );
      case 'uncompleted':
        return orderBy(
          todos.filter((o) => !o.isDone),
          ...order,
        );
      case 'completed':
        return orderBy(
          todos.filter((o) => o.isDone),
          ...order,
        );
    }
  }, [todos, filter]);

  if (getError) {
    return (
      <Result
        status="error"
        title="Failed to fetch the data"
        subTitle="Please try refreshing the page"
      />
    );
  }

  if (data?.length === 0) {
    return <Empty />;
  }

  return (
    <MasonryInfiniteGrid
      gap={16}
      align="stretch"
      maxStretchColumnSize={400}
      useResizeObserver
      observeChildren
    >
      {!data || isLoading
        ? Placeholder
        : data.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                data-grid-groupkey={1}
                className={styles.todo}
                todo={todo}
                onToggle={toggleDone}
                onEdit={onEdit}
                onRemove={remove}
              />
            );
          })}
    </MasonryInfiniteGrid>
  );
};

export const TodoList = React.memo(List);
