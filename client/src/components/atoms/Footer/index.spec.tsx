import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Footer } from './index';

describe('Footer', () => {
  it('renders Footer unchanged', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });

  it('should render links to social', () => {
    const { getByRole } = render(<Footer />);

    // Text links
    expect(getByRole('link', { name: 'Ant Design' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    // Images
    expect(getByRole('link', { name: 'github' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'instagram' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'linkedin' })).toBeInTheDocument();
  });

  it('should show effort spent on mouse hover', async () => {
    const { getByRole, findByRole, queryByRole } = render(<Footer />);

    const coffeeIcon = getByRole('img', { name: 'coffee' });
    expect(coffeeIcon).toBeInTheDocument();

    let tooltip = queryByRole('tooltip');
    expect(tooltip).not.toBeInTheDocument();

    await userEvent.hover(coffeeIcon);

    tooltip = await findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
  });
});
