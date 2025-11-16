import { render, screen, waitFor } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import DataUpload from '../DataUpload';
import { mockFile, mockCsvString } from '../../test/fixtures/mockData';

// Mock file reading
const mockFileReader = {
  readAsText: jest.fn(),
  result: mockCsvString,
  onload: null as any,
  onerror: null as any,
};

global.FileReader = jest.fn(() => mockFileReader) as any;

describe('DataUpload', () => {
  const mockOnDataLoad = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.readAsText.mockImplementation(function(this: any) {
      setTimeout(() => {
        this.result = mockCsvString;
        if (this.onload) this.onload();
      }, 100);
    });
  });

  it('should render upload interface', () => {
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    expect(screen.getByText('Upload Your Data')).toBeInTheDocument();
    expect(screen.getByText('Drop your CSV file here or click to browse')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument();
  });

  it('should show file requirements', () => {
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    expect(screen.getByText(/supported format/i)).toBeInTheDocument();
    expect(screen.getByText(/csv files with headers/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum file size: 10mb/i)).toBeInTheDocument();
  });

  it('should show sample CSV format', () => {
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    expect(screen.getByText('Sample CSV Format:')).toBeInTheDocument();
    expect(screen.getByText(/Name,Age,Score,Active/)).toBeInTheDocument();
  });

  it('should handle file selection via input', async () => {
    const user = userEvent.setup();
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, mockFile);
    
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
  });

  it('should validate file type', async () => {
    const user = userEvent.setup();
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, invalidFile);
    
    await waitFor(() => {
      expect(screen.getByText(/please upload a csv file/i)).toBeInTheDocument();
    });
  });

  it('should validate file size', async () => {
    const user = userEvent.setup();
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.csv', { type: 'text/csv' });
    
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, largeFile);
    
    await waitFor(() => {
      expect(screen.getByText(/file size too large/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during file processing', async () => {
    const user = userEvent.setup();
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, mockFile);
    
    // Should show loading skeleton
    expect(screen.getByTestId('upload-progress-skeleton')).toBeInTheDocument();
  });

  it('should call onDataLoad with parsed data', async () => {
    const user = userEvent.setup();
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, mockFile);
    
    await waitFor(() => {
      expect(mockOnDataLoad).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'John Doe',
            age: 25,
          }),
        ]),
        'test-data.csv'
      );
    }, { timeout: 2000 });
  });

  it('should show success message after upload', async () => {
    const user = userEvent.setup();
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, mockFile);
    
    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
      expect(screen.getByText(/processed 5 rows/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle drag and drop', async () => {
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const dropZone = screen.getByText(/drop your csv file here/i).closest('div');
    
    // Simulate drag enter
    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    dropZone?.dispatchEvent(dragEnterEvent);
    
    // Simulate drop
    const dropEvent = new Event('drop', { bubbles: true }) as any;
    dropEvent.dataTransfer = {
      files: [mockFile],
    };
    dropZone?.dispatchEvent(dropEvent);
    
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
  });

  it('should clear error when user dismisses it', async () => {
    const user = userEvent.setup();
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    render(<DataUpload onDataLoad={mockOnDataLoad} />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await user.upload(fileInput, invalidFile);
    
    await waitFor(() => {
      expect(screen.getByText(/please upload a csv file/i)).toBeInTheDocument();
    });
    
    const dismissButton = screen.getByRole('button', { name: /close/i });
    await user.click(dismissButton);
    
    expect(screen.queryByText(/please upload a csv file/i)).not.toBeInTheDocument();
  });
});