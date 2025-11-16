import { render, screen, waitFor } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { mockCsvData } from '../../test/fixtures/mockData';

// Mock the chart components
jest.mock('recharts', () => require('../../test/mocks/recharts'));

describe('Dashboard', () => {
  const mockProps = {
    data: mockCsvData,
    fileName: 'test-data.csv',
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading skeleton initially', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('should render dashboard after loading', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('5 rows')).toBeInTheDocument();
    expect(screen.getByText('6 columns')).toBeInTheDocument();
  });

  it('should display summary cards with correct data', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Records')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Columns')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('Numeric')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('should show sidebar navigation', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /charts/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /insights/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /data/i })).toBeInTheDocument();
    });
  });

  it('should switch tabs when navigation is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
    
    const chartsTab = screen.getByRole('button', { name: /charts/i });
    await user.click(chartsTab);
    
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });

  it('should show export buttons', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export data/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export report/i })).toBeInTheDocument();
    });
  });

  it('should display file name in sidebar', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('test-data.csv')).toBeInTheDocument();
    });
  });

  it('should show data quality percentage', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Quality')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument(); // No missing data in mock
    });
  });

  it('should render charts in overview mode', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      const resetButton = screen.getByRole('button', { name: /new upload/i });
      expect(resetButton).toBeInTheDocument();
    });
    
    const resetButton = screen.getByRole('button', { name: /new upload/i });
    await user.click(resetButton);
    
    expect(mockProps.onReset).toHaveBeenCalled();
  });

  it('should show stats bar with data information', async () => {
    render(<Dashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('5 rows')).toBeInTheDocument();
      expect(screen.getByText('6 columns')).toBeInTheDocument();
      expect(screen.getByText('3 numeric')).toBeInTheDocument();
      expect(screen.getByText('100% complete')).toBeInTheDocument();
    });
  });
});