import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type {
  ITodo,
  ITodoCreationAttributes,
  ITodoDeleteAttributes,
  ITodoUpdateAttributes,
} from 'todo-list';

const headers = {
  'content-type': 'application/json',
};

const GET = async (input: string) => {
  const response = await fetch(input, { headers });
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }
  return json;
};

const POST = async (
  input: string,
  { arg }: { arg: ITodoCreationAttributes },
) => {
  const response = await fetch(input, {
    method: 'POST',
    body: JSON.stringify(arg),
    headers,
  });
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }
  return json;
};

const PATCH = async (
  input: string,
  { arg }: { arg: ITodoUpdateAttributes },
) => {
  const { id, ...body } = arg;

  const response = await fetch(`${input}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers,
  });
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }
  return json;
};

const DELETE = async (
  input: string,
  { arg }: { arg: ITodoDeleteAttributes },
) => {
  const { id } = arg;

  const response = await fetch(`${input}/${id}`, { method: 'DELETE', headers });
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }
  return json;
};

export const useGetTodos = () => {
  const { data, isLoading, error } = useSWR<ITodo[]>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`,
    GET,
    { refreshInterval: 0 },
  );

  return {
    todos: data,
    isLoading,
    error,
  };
};

export const useCreateTodo = () => {
  const { data, trigger, isMutating, error } = useSWRMutation<ITodo>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`,
    POST,
  );

  return {
    todo: data,
    trigger,
    isMutating,
    error,
  };
};

export const usePatchTodo = () => {
  const { data, trigger, isMutating, error } = useSWRMutation<ITodo>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`,
    PATCH,
  );

  return {
    todo: data,
    trigger,
    isMutating,
    error,
  };
};

export const useDeleteTodo = () => {
  const { data, trigger, isMutating, error } = useSWRMutation<ITodo>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`,
    DELETE,
  );

  return {
    todo: data,
    trigger,
    isMutating,
    error,
  };
};
