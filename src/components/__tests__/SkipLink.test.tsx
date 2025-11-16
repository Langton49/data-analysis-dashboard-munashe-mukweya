import { render, screen } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SkipLink } from '../SkipLink';

describe('SkipLink', () => {
  it('should render skip link', () => {
    render(<SkipLink />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
  });

  it('should have correct href attribute', () => {
    render(<SkipLink />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should be focusable', async () => {
    const user = userEvent.setup();
    render(<SkipLink />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    
    await user.tab();
    expect(skipLink).toHaveFocus();
  });

  it('should have proper accessibility attributes', () => {
    render(<SkipLink />);
    
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveClass('sr-only');
    expect(skipLink).toHaveClass('focus:not-sr-only');
  });
});