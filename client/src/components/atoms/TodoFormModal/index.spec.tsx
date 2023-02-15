import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';

import * as handlers from '@/components/hooks/todos/msw-handlers';
import { TodoFormModal } from './index';

const server = setupServer();

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
    {children}
  </SWRConfig>
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const onCancel = jest.fn().mockImplementation(() => {});

describe('TodoFormModal', () => {
  it('renders nothing when open={false}', () => {
    const { queryByRole } = render(
      <TodoFormModal open={false} onCancel={onCancel} />,
      { wrapper: Wrapper },
    );

    expect(queryByRole('dialog')).toMatchSnapshot();
  });

  it('renders without change when open={true}', () => {
    const { queryByRole } = render(
      <TodoFormModal open={true} onCancel={onCancel} />,
      { wrapper: Wrapper },
    );
    expect(queryByRole('dialog')).toMatchSnapshot();
  });

  it('handles button clicks and triggers validations', async () => {
    const { getByText, getByLabelText } = render(
      <TodoFormModal open={true} onCancel={onCancel} />,
      { wrapper: Wrapper },
    );

    const button = getByText('Save');

    await userEvent.click(button);

    await waitFor(() => {
      expect(getByText('This field is required')).toBeInTheDocument();
    });

    const input = getByLabelText('Title');

    fireEvent.change(input, {
      target: {
        value: 'Something very long here so that it exceeds 20 symbols',
      },
    });

    await waitFor(() => {
      expect(
        getByText('This field cannot be longer than 20 characters'),
      ).toBeInTheDocument();
    });

    fireEvent.change(input, {
      target: {
        value: '',
      },
    });

    await waitFor(() => {
      expect(getByText('This field is required')).toBeInTheDocument();
    });

    const closeButton = getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(onCancel).toBeCalled();
  });

  describe('form submission (success)', () => {
    beforeEach(() => {
      server.use(handlers.postSuccess, handlers.patchSuccess);
    });

    it('handles create', async () => {
      const { getByText, getByLabelText } = render(
        <TodoFormModal
          initialState={undefined}
          open={true}
          onCancel={onCancel}
        />,
        { wrapper: Wrapper },
      );

      const button = getByText('Save');
      const input = getByLabelText('Title');

      fireEvent.change(input, {
        target: {
          value: 'Test Title',
        },
      });

      await userEvent.click(button);

      expect(onCancel).toBeCalled();
    });

    it('handles patch', async () => {
      const { getByText } = render(
        <TodoFormModal
          initialState={handlers.todo}
          open={true}
          onCancel={onCancel}
        />,
        { wrapper: Wrapper },
      );

      const button = getByText('Save');
      await userEvent.click(button);

      expect(onCancel).toBeCalled();
    });
  });

  describe('form submission (error)', () => {
    beforeEach(() => {
      server.use(handlers.postError, handlers.patchError);
    });

    it('handles create', async () => {
      const { getByText, getByLabelText } = render(
        <TodoFormModal
          initialState={undefined}
          open={true}
          onCancel={onCancel}
        />,
        { wrapper: Wrapper },
      );

      const button = getByText('Save');
      const input = getByLabelText('Title');

      fireEvent.change(input, {
        target: {
          value: 'Test Title',
        },
      });

      await userEvent.click(button);
    });

    it('handles patch', async () => {
      const { getByText } = render(
        <TodoFormModal
          initialState={handlers.todo}
          open={true}
          onCancel={onCancel}
        />,
        { wrapper: Wrapper },
      );

      const button = getByText('Save');
      await userEvent.click(button);
    });
  });
});
