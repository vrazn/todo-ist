import { act, renderHook, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';
import { ITodo } from 'todo-list';

import { useGetTodos, useCreateTodo, usePatchTodo, useDeleteTodo } from '.';
import * as handlers from './msw-handlers';

const server = setupServer();

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
    {children}
  </SWRConfig>
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useGetTodos', () => {
  describe('on successful fetch', () => {
    beforeEach(() => {
      server.use(handlers.getSuccess);
    });

    it('should toggle the loading and return the data', async () => {
      const { result } = renderHook(() => useGetTodos(), { wrapper: Wrapper });

      expect(result.current.todos).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(undefined);

      await waitFor(() => {
        expect(result.current.todos).toEqual(handlers.todos);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(undefined);
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      server.use(handlers.getError);
    });

    it('should toggle the loading and return the error', async () => {
      const { result } = renderHook(() => useGetTodos());

      expect(result.current.todos).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(undefined);

      await waitFor(() => {
        expect(result.current.todos).toBe(undefined);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual(handlers.error);
      });
    });
  });
});

describe('useCreateTodo', () => {
  describe('on successful create', () => {
    beforeEach(() => {
      server.use(handlers.postSuccess);
    });

    it('should toggle the loading and return the new data', async () => {
      const { result } = renderHook(() => useCreateTodo(), {
        wrapper: Wrapper,
      });

      expect(result.current.todo).toBe(undefined);
      expect(result.current.isMutating).toBe(false);
      expect(result.current.error).toBe(undefined);

      act(() => {
        result.current.trigger();
      });

      await waitFor(() => {
        expect(result.current.isMutating).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.todo).toEqual(handlers.todo);
        expect(result.current.isMutating).toBe(false);
        expect(result.current.error).toBe(undefined);
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      server.use(handlers.postError);
    });

    it('should toggle the loading and return the error', async () => {
      const { result } = renderHook(() => useCreateTodo());

      expect(result.current.todo).toBe(undefined);
      expect(result.current.isMutating).toBe(false);
      expect(result.current.error).toBe(undefined);

      let promise: Promise<ITodo | undefined>;

      act(() => {
        promise = result.current.trigger();
      });

      await waitFor(() => {
        expect(result.current.isMutating).toBe(true);
      });

      await waitFor(async () => {
        await expect(promise).rejects.toEqual(handlers.error);
        expect(result.current.todo).toBe(undefined);
        expect(result.current.isMutating).toBe(false);
        expect(result.current.error).toEqual(handlers.error);
      });
    });
  });
});

describe('usePatchTodo', () => {
  describe('on successful patch', () => {
    beforeEach(() => {
      server.use(handlers.patchSuccess);
    });

    it('should toggle the loading and return the new data', async () => {
      const { result } = renderHook(() => usePatchTodo(), {
        wrapper: Wrapper,
      });

      expect(result.current.todo).toBe(undefined);
      expect(result.current.isMutating).toBe(false);
      expect(result.current.error).toBe(undefined);

      act(() => {
        result.current.trigger({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isMutating).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.todo).toEqual(handlers.todo);
        expect(result.current.isMutating).toBe(false);
        expect(result.current.error).toBe(undefined);
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      server.use(handlers.patchError);
    });

    it('should toggle the loading and return the error', async () => {
      const { result } = renderHook(() => usePatchTodo());

      expect(result.current.todo).toBe(undefined);
      expect(result.current.isMutating).toBe(false);
      expect(result.current.error).toBe(undefined);

      let promise: Promise<ITodo | undefined>;

      act(() => {
        promise = result.current.trigger({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isMutating).toBe(true);
      });

      await waitFor(async () => {
        await expect(promise).rejects.toEqual(handlers.error);
        expect(result.current.todo).toBe(undefined);
        expect(result.current.isMutating).toBe(false);
        expect(result.current.error).toEqual(handlers.error);
      });
    });
  });
});

describe('useDeleteTodo', () => {
  describe('on successful delete', () => {
    beforeEach(() => {
      server.use(handlers.deleteSuccess);
    });

    it('should toggle the loading and return the new data', async () => {
      const { result } = renderHook(() => useDeleteTodo(), {
        wrapper: Wrapper,
      });

      expect(result.current.todo).toBe(undefined);
      expect(result.current.isMutating).toBe(false);
      expect(result.current.error).toBe(undefined);

      act(() => {
        result.current.trigger({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isMutating).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.todo).toEqual(handlers.todo);
        expect(result.current.isMutating).toBe(false);
        expect(result.current.error).toBe(undefined);
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      server.use(handlers.deleteError);
    });

    it('should toggle the loading and return the error', async () => {
      const { result } = renderHook(() => useDeleteTodo());

      expect(result.current.todo).toBe(undefined);
      expect(result.current.isMutating).toBe(false);
      expect(result.current.error).toBe(undefined);

      let promise: Promise<ITodo | undefined>;

      act(() => {
        promise = result.current.trigger({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isMutating).toBe(true);
      });

      await waitFor(async () => {
        await expect(promise).rejects.toEqual(handlers.error);
        expect(result.current.todo).toBe(undefined);
        expect(result.current.isMutating).toBe(false);
        expect(result.current.error).toEqual(handlers.error);
      });
    });
  });
});
