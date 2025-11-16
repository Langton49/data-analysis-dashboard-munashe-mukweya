
// ==========================================
// 📤 Stock Data Upload Component - Historical Stock Data Processing
// ==========================================
// This component handles historical stock data CSV uploads for comprehensive
// market analysis including OHLC charts, volume analysis, and AI insights

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, FileSpreadsheet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow } from '@/types/data';
import { UploadProgressSkeleton } from './skeletons';

// 📋 Props interface - defines what data this component expects
interface DataUploadProps {
  onDataLoad: (data: DataRow[], fileName: string) => void;
}

// 📊 Upload statistics interface
interface UploadStats {
  fileName: string;
  fileSize: string;
  rowCount: number;
  columnCount: number;
  processingTime: number;
}

const DataUpload = ({ onDataLoad }: DataUploadProps) => {
  // 🧠 Component state - manages upload process and UI feedback
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stats, setStats] = useState<UploadStats | null>(null);
  
  // 🔧 WEEK 3: Add form validation state here
  // Example: const [validationErrors, setValidationErrors] = useState([]);
  
  // 🔧 WEEK 4: Add data processing state here
  // Example: const [processingStatus, setProcessingStatus] = useState('idle');
  
  // 🔧 WEEK 5: Add advanced file handling state here
  // Example: const [fileMetadata, setFileMetadata] = useState(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return 'Please upload a historical stock data CSV file (.csv extension required)';
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size too large. Please upload files smaller than 10MB';
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File appears to be empty. Please upload a valid stock data CSV file';
    }

    return null;
  };

  const parseCSV = (text: string): DataRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    // Parse CSV with better handling of quoted values and commas
    const parseCSVLine = (line: string): string[] => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            current += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of field
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
    const data: DataRow[] = [];
    let validRows = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = parseCSVLine(line);
      
      // Skip rows that don't match header count (unless they're completely empty)
      if (values.length !== headers.length) {
        console.warn(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Skipping.`);
        continue;
      }

      const row: DataRow = {};
      let hasData = false;

      headers.forEach((header, index) => {
        let value: string | number | boolean | null = values[index]?.replace(/^"|"$/g, '') || '';
        
        // Skip completely empty rows
        if (value !== '') hasData = true;
        
        // Try to parse as number
        if (value !== '' && !isNaN(Number(value)) && value !== 'true' && value !== 'false') {
          const numValue = Number(value);
          if (Number.isFinite(numValue)) {
            value = numValue;
          }
        } else if (value.toLowerCase() === 'true') {
          value = true;
        } else if (value.toLowerCase() === 'false') {
          value = false;
        } else if (value === '') {
          value = null;
        }
        
        row[header] = value;
      });

      if (hasData) {
        data.push(row);
        validRows++;
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV file');
    }

    console.log(`Parsed ${validRows} valid rows from ${lines.length - 1} total rows`);
    return data;
  };

  const handleFile = async (file: File) => {
    const startTime = Date.now();
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate progressive loading for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const text = await file.text();
      const data = parseCSV(text);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      const processingTime = Date.now() - startTime;
      const uploadStats: UploadStats = {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
        processingTime
      };

      setStats(uploadStats);
      
      // Small delay to show completion
      setTimeout(() => {
        console.log('Upload successful:', uploadStats);
        onDataLoad(data, file.name);
      }, 500);

    } catch (err) {
      setUploadProgress(0);
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse CSV file';
      setError(`Processing failed: ${errorMessage}`);
      console.error('CSV parsing error:', err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      setError('Please upload only one file at a time');
      return;
    }
    
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input to allow same file selection
    e.target.value = '';
  };

  const clearError = () => setError(null);

  // Show skeleton during loading
  if (isLoading) {
    return <UploadProgressSkeleton />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {stats && !error && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium text-green-800">Upload successful!</p>
              <p className="text-sm text-green-700">
                Processed <strong>{stats.rowCount.toLocaleString()}</strong> rows and{' '}
                <strong>{stats.columnCount}</strong> columns from{' '}
                <strong>{stats.fileName}</strong> ({stats.fileSize}) in {stats.processingTime}ms
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 font-light">
            <FileSpreadsheet className="h-6 w-6" />
            Upload Your Data
          </CardTitle>
          <CardDescription className="font-light">
            Drop your CSV file here or click to browse. Maximum file size: 10MB
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? 'border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                : isLoading
                ? 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-lg ${
                isLoading ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                ) : (
                  <Upload className={`h-8 w-8 ${isDragging ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`} />
                )}
              </div>
              
              <div>
                <p className="text-lg font-light">
                  {isLoading ? 'Processing your stock data...' : 
                   isDragging ? 'Drop your stock data CSV here' : 'Drop your stock data CSV here'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
                  {isLoading ? 'Please wait while we analyze your market data' : 'or click to browse your historical stock files'}
                </p>
              </div>

              {isLoading && (
                <div className="w-full max-w-xs space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    {uploadProgress < 90 ? 'Reading stock data...' : 'Analyzing market trends...'}
                  </p>
                </div>
              )}

              {!isLoading && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="flex items-center space-x-2 font-light"
                >
                  <FileText className="h-4 w-4" />
                  <span>Choose Stock Data File</span>
                </Button>
              )}

              <input
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-light text-center space-y-1">
              <p><strong className="font-normal">Expected columns:</strong> Date, Price, Open, High, Low, Vol., Change%</p>
              <p><strong className="font-normal">File format:</strong> CSV with headers, UTF-8 encoding, comma-separated</p>
              <p><strong className="font-normal">Sample data:</strong> Check the sample-data folder for examples</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-light mb-2">Sample CSV Format:</h4>
              <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono">
{`Date,Price,Open,High,Low,Vol.,Change %
11/14/2025,276.41,271.40,278.56,270.70,31.65M,-0.78%
11/13/2025,278.57,282.34,282.84,277.24,29.49M,-2.84%
11/12/2025,286.71,291.67,292.01,283.69,24.83M,-1.58%
11/11/2025,291.31,287.74,291.92,287.32,19.84M,0.42%`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUpload;
