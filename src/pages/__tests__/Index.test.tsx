import { render, screen, waitFor } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import Index from '../Index';

// Mock the Dashboard component
jest.mock('../../components/Dashboard', () => {
  return function MockDashboard({ fileName, onReset }: any) {
    return (
      <div data-testid="dashboard">
        <p>Dashboard for {fileName}</p>
        <button onClick={onReset}>Reset</button>
      </div>
    );
  };
});

// Mock DataUpload component
jest.mock('../../components/DataUpload', () => {
  return function MockDataUpload({ onDataLoad }: any) {
    return (
      <div data-testid="data-upload">
        <button
          onClick={() => onDataLoad([{ id: 1, name: 'Test' }], 'test.csv')}
        >
          Mock Upload
        </button>
      </div>
    );
  };
});

describe('Index Page', () => {
  it('should render the homepage with title and description', () => {
    render(<Index />);
    
    expect(screen.getByRole('heading', { name: /data visualizer/i })).toBeInTheDocument();
    expect(screen.getByText('Interactive Data Analysis')).toBeInTheDocument();
    expect(screen.getByText(/upload your dataset and instantly discover insights/i)).toBeInTheDocument();
  });

  it('should show theme toggle', () => {
    render(<Index />);
    
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('should display feature cards', () => {
    render(<Index />);
    
    expect(screen.getByText('Easy Data Upload')).toBeInTheDocument();
    expect(screen.getByText('Interactive Charts')).toBeInTheDocument();
    expect(screen.getByText('Smart Insights')).toBeInTheDocument();
    
    expect(screen.getByText(/simply drag and drop your csv files/i)).toBeInTheDocument();
    expect(screen.getByText(/automatically generate bar charts/i)).toBeInTheDocument();
    expect(screen.getByText(/discover patterns, trends/i)).toBeInTheDocument();
  });

  it('should show upload section initially', () => {
    render(<Index />);
    
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Upload your CSV file to begin exploring your data')).toBeInTheDocument();
    expect(screen.getByTestId('data-upload')).toBeInTheDocument();
  });

  it('should switch to dashboard when data is uploaded', async () => {
    const user = userEvent.setup();
    render(<Index />);
    
    // Initially should show upload interface
    expect(screen.getByTestId('data-upload')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
    
    // Click mock upload button
    const uploadButton = screen.getByText('Mock Upload');
    await user.click(uploadButton);
    
    // Should now show dashboard
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      expect(screen.getByText('Dashboard for test.csv')).toBeInTheDocument();
    });
    
    // Should not show upload interface
    expect(screen.queryByTestId('data-upload')).not.toBeInTheDocument();
  });

  it('should return to upload screen when reset is clicked', async () => {
    const user = userEvent.setup();
    render(<Index />);
    
    // Upload data first
    const uploadButton = screen.getByText('Mock Upload');
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    await user.click(resetButton);
    
    // Should return to upload screen
    await waitFor(() => {
      expect(screen.getByTestId('data-upload')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
    });
  });

  it('should have proper accessibility structure', () => {
    render(<Index />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Data Visualizer logo')).toBeInTheDocument();
    
    // Check sections have proper labels
    expect(screen.getByLabelText('Features')).toBeInTheDocument();
    expect(screen.getByLabelText('Data upload')).toBeInTheDocument();
  });

  it('should have proper heading hierarchy', () => {
    render(<Index />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Data Visualizer');
    
    const featureHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(featureHeadings).toHaveLength(3); // Three feature cards
  });

  it('should show logo with proper styling', () => {
    render(<Index />);
    
    const logo = screen.getByLabelText('Data Visualizer logo');
    expect(logo).toBeInTheDocument();
    
    // Should contain database icon
    const databaseIcon = logo.querySelector('svg');
    expect(databaseIcon).toBeInTheDocument();
  });
});