import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { todos } from '@/components/hooks/todos/msw-handlers';
import { TodoItem } from './index';

const onToggle = jest.fn().mockImplementation(() => {});
const onEdit = jest.fn().mockImplementation(() => {});
const onRemove = jest.fn().mockImplementation(() => {});

describe('TodoItem', () => {
  it('renders without change', async () => {
    const container1 = render(
      <TodoItem
        todo={todos[0]}
        onToggle={onToggle}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );
    const container2 = render(
      <TodoItem
        todo={todos[1]}
        onToggle={onToggle}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );
    const container3 = render(
      <TodoItem
        todo={todos[2]}
        onToggle={onToggle}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );

    expect(container1).toMatchSnapshot();
    expect(container2).toMatchSnapshot();
    expect(container3).toMatchSnapshot();
  });

  it('handles button clicks', async () => {
    const { getByLabelText, getByRole } = render(
      <TodoItem
        todo={todos[0]}
        onToggle={onToggle}
        onEdit={onEdit}
        onRemove={onRemove}
      />,
    );

    const toggleButton = getByLabelText('check-circle');
    const editButton = getByLabelText('edit');
    const deleteButton = getByLabelText('delete');

    await userEvent.click(toggleButton);
    await userEvent.click(editButton);

    expect(onToggle).toBeCalled();
    expect(onEdit).toBeCalled();

    await userEvent.click(deleteButton);

    const yesButton = getByRole('button', { name: 'Yes' });
    await userEvent.click(yesButton);

    expect(onRemove).toBeCalled();
  });
});
