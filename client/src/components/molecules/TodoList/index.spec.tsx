import {
  act,
  findByText,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';
import tk from 'timekeeper';

import * as handlers from '@/components/hooks/todos/msw-handlers';
import { TodoList } from './index';

const server = setupServer(handlers.patchSuccess);

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
    {children}
  </SWRConfig>
);

beforeAll(() => {
  server.listen();
  tk.travel('2023-01-01');
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  tk.reset();
});

const onEdit = jest.fn().mockImplementation(() => {});

describe('TodoFormModal', () => {
  describe('common', () => {
    beforeEach(() => {
      server.use(handlers.getSuccess);
    });

    it('should toggle the loading and show the data', async () => {
      const { container } = await act(async () =>
        render(<TodoList filter="all" onEdit={onEdit} />, { wrapper: Wrapper }),
      );

      let skeletons = container.getElementsByClassName('ant-skeleton');
      expect(skeletons.length).toBe(10);
      expect(container).toMatchSnapshot();
    });

    it('should handle button click', async () => {
      const { getByText, getAllByLabelText } = await act(async () =>
        render(<TodoList filter="all" onEdit={onEdit} />, { wrapper: Wrapper }),
      );

      const buttons = await waitFor(() => {
        const toggleButtons = getAllByLabelText('check-circle');
        return toggleButtons;
      });

      expect(buttons).toHaveLength(3);

      if (Array.isArray(buttons) && buttons.every((o) => o)) {
        await act(async () => userEvent.click(buttons[0]));
      }
    });
  });

  describe('on successful fetch', () => {
    beforeEach(() => {
      server.use(handlers.getSuccess);
    });

    it('should show all todos after loading', async () => {
      const { getAllByTestId } = await act(async () =>
        render(<TodoList filter="all" onEdit={onEdit} />, { wrapper: Wrapper }),
      );

      await waitFor(() => {
        const allItems = getAllByTestId('todo-item');
        expect(allItems).toHaveLength(3);
      });
    });

    it("should show today's todos after loading", async () => {
      const { getAllByTestId } = await act(async () =>
        render(<TodoList filter="today" onEdit={onEdit} />, {
          wrapper: Wrapper,
        }),
      );

      await waitFor(() => {
        const todayItems = getAllByTestId('todo-item');
        expect(todayItems).toHaveLength(1);
      });
    });

    it('should show important todos after loading', async () => {
      const { getAllByTestId } = await act(async () =>
        render(<TodoList filter="important" onEdit={onEdit} />, {
          wrapper: Wrapper,
        }),
      );

      await waitFor(() => {
        const importantItems = getAllByTestId('todo-item');
        expect(importantItems).toHaveLength(2);
      });
    });

    it('should show uncompleted todos after loading', async () => {
      const { getAllByTestId } = await act(async () =>
        render(<TodoList filter="uncompleted" onEdit={onEdit} />, {
          wrapper: Wrapper,
        }),
      );

      await waitFor(() => {
        const uncompletedItems = getAllByTestId('todo-item');
        expect(uncompletedItems).toHaveLength(2);
      });
    });

    it('should show completed todos after loading', async () => {
      const { getAllByTestId } = await act(async () =>
        render(<TodoList filter="completed" onEdit={onEdit} />, {
          wrapper: Wrapper,
        }),
      );

      await waitFor(() => {
        const completedItems = getAllByTestId('todo-item');
        expect(completedItems).toHaveLength(1);
      });
    });
  });

  describe('on empty fetch', () => {
    beforeEach(() => {
      server.use(handlers.getEmpty);
    });

    it('should show empty placeholder after loading', async () => {
      const { container, getByText } = await act(async () =>
        render(<TodoList filter="all" onEdit={onEdit} />, { wrapper: Wrapper }),
      );

      await waitFor(() => {
        const emptyPlaceholder = getByText('No data');
        expect(emptyPlaceholder).toBeInTheDocument();
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      server.use(handlers.getError);
    });

    it('should toggle the loading and show error message', async () => {
      const { container, getByText } = await act(async () =>
        render(<TodoList filter="all" onEdit={onEdit} />, { wrapper: Wrapper }),
      );

      await waitFor(() => {
        const emptyPlaceholder = getByText('Failed to fetch the data');
        expect(emptyPlaceholder).toBeInTheDocument();
        expect(container).toMatchSnapshot();
      });
    });
  });
});
