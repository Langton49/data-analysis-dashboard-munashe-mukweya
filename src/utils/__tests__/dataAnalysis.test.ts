import { getDataSummary, generateDataInsights, getColumnValues } from '../dataAnalysis';
import { mockCsvData } from '../../test/fixtures/mockData';

describe('dataAnalysis utils', () => {
  describe('getDataSummary', () => {
    it('should return correct summary for mock data', () => {
      const summary = getDataSummary(mockCsvData);
      
      expect(summary.totalRows).toBe(5);
      expect(summary.totalColumns).toBe(6);
      expect(summary.numericColumns).toBe(3); // id, age, salary
      expect(summary.textColumns).toBe(2); // name, department
      expect(summary.columnTypes).toEqual({
        id: 'numeric',
        name: 'text',
        age: 'numeric',
        salary: 'numeric',
        department: 'text',
        active: 'boolean',
      });
    });

    it('should handle empty data', () => {
      const summary = getDataSummary([]);
      
      expect(summary.totalRows).toBe(0);
      expect(summary.totalColumns).toBe(0);
      expect(summary.numericColumns).toBe(0);
      expect(summary.textColumns).toBe(0);
    });

    it('should calculate missing values correctly', () => {
      const dataWithMissing = [
        { name: 'John', age: 25, salary: null },
        { name: null, age: 30, salary: 50000 },
        { name: 'Jane', age: null, salary: 60000 },
      ];
      
      const summary = getDataSummary(dataWithMissing);
      
      expect(summary.missingValues.name).toBe(1);
      expect(summary.missingValues.age).toBe(1);
      expect(summary.missingValues.salary).toBe(1);
    });
  });

  describe('generateDataInsights', () => {
    it('should generate insights for mock data', () => {
      const insights = generateDataInsights(mockCsvData);
      
      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBeGreaterThan(0);
      
      // Check that insights have required properties
      insights.forEach(insight => {
        expect(insight).toHaveProperty('title');
        expect(insight).toHaveProperty('description');
        expect(insight).toHaveProperty('type');
        expect(['trend', 'outlier', 'correlation']).toContain(insight.type);
      });
    });

    it('should handle empty data gracefully', () => {
      const insights = generateDataInsights([]);
      
      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBe(0);
    });
  });

  describe('getColumnValues', () => {
    it('should extract column values correctly', () => {
      const names = getColumnValues(mockCsvData, 'name');
      const ages = getColumnValues(mockCsvData, 'age');
      
      expect(names).toEqual(['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']);
      expect(ages).toEqual([25, 30, 35, 28, 32]);
    });

    it('should filter out null and undefined values', () => {
      const dataWithNulls = [
        { name: 'John', value: 10 },
        { name: null, value: 20 },
        { name: 'Jane', value: null },
        { name: undefined, value: 30 },
      ];
      
      const names = getColumnValues(dataWithNulls, 'name');
      const values = getColumnValues(dataWithNulls, 'value');
      
      expect(names).toEqual(['John', 'Jane']);
      expect(values).toEqual([10, 20, 30]);
    });

    it('should return empty array for non-existent column', () => {
      const result = getColumnValues(mockCsvData, 'nonexistent');
      
      expect(result).toEqual([]);
    });
  });
});