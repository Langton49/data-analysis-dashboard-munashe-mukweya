import { generateSystemPrompt, dataToCSV, getMockResponse } from '../openai';
import { mockCsvData, mockInsights } from '../../test/fixtures/mockData';

// Mock fetch for API tests
global.fetch = jest.fn();

describe('OpenAI utilities', () => {
  describe('dataToCSV', () => {
    it('should convert data to CSV format', () => {
      const csv = dataToCSV(mockCsvData, 3);
      
      expect(csv).toContain('id,name,age,salary,department,active');
      expect(csv).toContain('1,John Doe,25,50000,Engineering,true');
      expect(csv).toContain('2,Jane Smith,30,65000,Marketing,true');
      expect(csv).toContain('3,Bob Johnson,35,75000,Engineering,false');
      
      // Should only include first 3 rows (plus header)
      const lines = csv.split('\n');
      expect(lines).toHaveLength(4); // header + 3 data rows
    });

    it('should handle empty data', () => {
      const csv = dataToCSV([]);
      
      expect(csv).toBe('');
    });

    it('should escape values with commas and quotes', () => {
      const dataWithSpecialChars = [
        { name: 'John, Jr.', description: 'He said "Hello"' },
        { name: 'Jane\nSmith', description: 'Normal text' },
      ];
      
      const csv = dataToCSV(dataWithSpecialChars);
      
      expect(csv).toContain('"John, Jr."');
      expect(csv).toContain('"He said ""Hello"""');
      expect(csv).toContain('"Jane\nSmith"');
    });

    it('should respect maxRows parameter', () => {
      const csv = dataToCSV(mockCsvData, 2);
      const lines = csv.split('\n');
      
      expect(lines).toHaveLength(3); // header + 2 data rows
    });
  });

  describe('generateSystemPrompt', () => {
    const mockDataContext = {
      summary: {
        totalRows: 5,
        totalColumns: 6,
        numericColumns: 3,
        textColumns: 2,
        columnTypes: {
          id: 'numeric',
          name: 'text',
          age: 'numeric',
          salary: 'numeric',
          department: 'text',
          active: 'boolean',
        },
      },
      insights: mockInsights,
      numericColumns: ['id', 'age', 'salary'],
    };

    it('should generate system prompt without sample data', () => {
      const prompt = generateSystemPrompt(mockDataContext);
      
      expect(prompt).toContain('You are a helpful data analysis assistant');
      expect(prompt).toContain('Total Rows: 5');
      expect(prompt).toContain('Total Columns: 6');
      expect(prompt).toContain('Numeric Columns: 3 (id, age, salary)');
      expect(prompt).toContain('Text Columns: 2');
      expect(prompt).toContain('Average Salary');
      expect(prompt).not.toContain('Sample Data');
    });

    it('should generate system prompt with sample data', () => {
      const contextWithData = {
        ...mockDataContext,
        sampleData: 'id,name,age\n1,John,25\n2,Jane,30',
      };
      
      const prompt = generateSystemPrompt(contextWithData);
      
      expect(prompt).toContain('Sample Data (first 5 rows in CSV format)');
      expect(prompt).toContain('```csv\nid,name,age\n1,John,25\n2,Jane,30\n```');
      expect(prompt).toContain('Use the actual data above to answer specific questions');
    });

    it('should include insights in the prompt', () => {
      const prompt = generateSystemPrompt(mockDataContext);
      
      expect(prompt).toContain('Key Insights:');
      expect(prompt).toContain('Average Salary: The average salary across all employees is $63,000');
      expect(prompt).toContain('Department Distribution: Engineering has the highest representation');
    });
  });

  describe('getMockResponse', () => {
    const mockDataContext = {
      summary: {
        totalRows: 5,
        totalColumns: 6,
        numericColumns: 3,
        textColumns: 2,
        columnTypes: {},
      },
      insights: mockInsights,
      numericColumns: ['id', 'age', 'salary'],
    };

    it('should return summary response for summary questions', () => {
      const response = getMockResponse('Give me a summary', mockDataContext);
      
      expect(response).toContain('Dataset Overview');
      expect(response).toContain('5 total rows');
      expect(response).toContain('6 columns');
      expect(response).toContain('3 numeric, 2 text');
      expect(response).toContain('Top Insights');
    });

    it('should return chart response for visualization questions', () => {
      const response = getMockResponse('What charts should I create?', mockDataContext);
      
      expect(response).toContain('visualization recommendations');
      expect(response).toContain('Scatter Plot');
      expect(response).toContain('Bar Chart');
      expect(response).toContain('Line Chart');
    });

    it('should return generic response for other questions', () => {
      const response = getMockResponse('Random question', mockDataContext);
      
      expect(response).toContain('Random question');
      expect(response).toContain('Data Analysis Questions');
      expect(response).toContain('5 rows and 6 columns');
    });
  });
});