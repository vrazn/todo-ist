import { render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';

import * as handlers from '@/components/hooks/todos/msw-handlers';

import { Header, getProgressWidth } from './index';

const server = setupServer();

const TestComponent = () => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
    <Header />
  </SWRConfig>
);

describe('progress width', () => {
  it('returns various widths depending on the screen size', () => {
    expect(
      getProgressWidth({
        xs: false,
        sm: false,
        md: false,
        lg: false,
        xl: false,
        xxl: true,
      }),
    ).toBe(300);
    expect(
      getProgressWidth({
        xs: false,
        sm: false,
        md: false,
        lg: false,
        xl: true,
        xxl: false,
      }),
    ).toBe(300);
    expect(
      getProgressWidth({
        xs: false,
        sm: false,
        md: false,
        lg: true,
        xl: false,
        xxl: false,
      }),
    ).toBe(250);
    expect(
      getProgressWidth({
        xs: false,
        sm: false,
        md: true,
        lg: false,
        xl: false,
        xxl: false,
      }),
    ).toBe(250);
    expect(
      getProgressWidth({
        xs: false,
        sm: true,
        md: false,
        lg: false,
        xl: false,
        xxl: false,
      }),
    ).toBe(200);
    expect(
      getProgressWidth({
        xs: true,
        sm: false,
        md: false,
        lg: false,
        xl: false,
        xxl: false,
      }),
    ).toBe(100);
  });
});

describe('Header', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('on initial load', () => {
    beforeEach(() => server.use(handlers.getSuccess));

    it('renders without change', () => {
      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    it('renders avatar only while the data is being loaded', () => {
      const { getByRole, queryByRole } = render(<TestComponent />);

      expect(getByRole('img')).toBeInTheDocument();
      expect(queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('on fetch returning an empty array', () => {
    beforeEach(() => server.use(handlers.getEmpty));

    it('renders avatar and an empty progress bar after loading is complete', async () => {
      const { findByRole, findByText } = render(<TestComponent />);

      await waitFor(async () => {
        expect(await findByRole('img')).toBeInTheDocument();
        const progressbar = await findByRole('progressbar');
        expect(progressbar).toBeInTheDocument();
        expect(await findByText('0%')).toBeInTheDocument();
      });
    });
  });

  describe('on fetch returning non-empty array', () => {
    beforeEach(() => server.use(handlers.getSuccess));

    it('renders without change', () => {
      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    it('renders avatar only while the data is being loaded', () => {
      const { getByRole, queryByRole } = render(<TestComponent />);

      expect(getByRole('img')).toBeInTheDocument();
      expect(queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('renders avatar and fills the progress bar after loading is complete', async () => {
      const { findByRole, findByText } = render(<TestComponent />);

      await waitFor(async () => {
        expect(await findByRole('img')).toBeInTheDocument();
        const progressbar = await findByRole('progressbar');
        expect(progressbar).toBeInTheDocument();

        const doneCount = handlers.todos.reduce((acc, curr) => {
          if (curr.isDone) acc++;
          return acc;
        }, 0);

        const percent = Math.round((doneCount / handlers.todos.length) * 100);

        expect(await findByText(`${percent}%`)).toBeInTheDocument();
      });
    });
  });

  describe('on fetch returning error', () => {
    beforeEach(() => server.use(handlers.getError));

    it('renders without change', () => {
      const { container } = render(<TestComponent />);
      expect(container).toMatchSnapshot();
    });

    it('renders avatar and an empty progress bar after loading is complete', async () => {
      const { findByRole, findByText } = render(<TestComponent />);

      await waitFor(async () => {
        expect(await findByRole('img')).toBeInTheDocument();
        const progressbar = await findByRole('progressbar');
        expect(progressbar).toBeInTheDocument();
        expect(await findByText('0%')).toBeInTheDocument();
      });
    });
  });
});
