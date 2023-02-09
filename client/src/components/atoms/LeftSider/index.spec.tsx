import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LeftSider } from './index';

const onPressAdd = jest.fn().mockImplementation(() => {});
const onMenuSelect = jest.fn().mockImplementation(() => {});

describe('LeftSider', () => {
  describe('when screen is small', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(
          () =>
            ({
              addListener: (cb: (e: { matches: boolean }) => void) => {
                cb({ matches: false });
              },
              removeListener: jest.fn(),
              matches: false,
            } as any),
        ),
      });
    });

    it('renders without change', async () => {
      const { container } = await act(async () =>
        render(
          <LeftSider onPressAdd={onPressAdd} onMenuSelect={onMenuSelect} />,
        ),
      );

      expect(container).toMatchSnapshot();
    });

    it('renders button without text', async () => {
      const { queryByText } = await act(async () =>
        render(
          <LeftSider onPressAdd={onPressAdd} onMenuSelect={onMenuSelect} />,
        ),
      );

      expect(queryByText('Add new task')).not.toBeInTheDocument();
    });
  });

  describe('when screen is large', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(
          () =>
            ({
              addListener: (cb: (e: { matches: boolean }) => void) => {
                cb({ matches: true });
              },
              removeListener: jest.fn(),
              matches: true,
            } as any),
        ),
      });
    });

    it('renders without change', async () => {
      const { container } = await act(async () =>
        render(
          <LeftSider onPressAdd={onPressAdd} onMenuSelect={onMenuSelect} />,
        ),
      );

      expect(container).toMatchSnapshot();
    });

    it('renders button with text and handles clicks', async () => {
      const { getByText } = await act(async () =>
        render(
          <LeftSider onPressAdd={onPressAdd} onMenuSelect={onMenuSelect} />,
        ),
      );

      const button = getByText('Add new task');
      expect(button).toBeInTheDocument();

      await userEvent.click(button);

      expect(onPressAdd).toBeCalledTimes(1);
    });

    it('renders menu items and handles clicks', async () => {
      const { queryAllByRole } = await act(async () =>
        render(
          <LeftSider onPressAdd={onPressAdd} onMenuSelect={onMenuSelect} />,
        ),
      );

      const menuItems = queryAllByRole('menuitem');
      expect(menuItems.length).toBe(5);
      expect(menuItems[0]).toHaveClass('ant-menu-item-selected');
      expect(menuItems[4]).not.toHaveClass('ant-menu-item-selected');

      await userEvent.click(menuItems[4]);

      expect(onMenuSelect).toBeCalledTimes(1);
      expect(menuItems[0]).not.toHaveClass('ant-menu-item-selected');
      expect(menuItems[4]).toHaveClass('ant-menu-item-selected');
    });
  });
});
