import { DataRow } from '@/types/data';

export const mockCsvData: DataRow[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 25,
    salary: 50000,
    department: 'Engineering',
    active: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 30,
    salary: 65000,
    department: 'Marketing',
    active: true,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    age: 35,
    salary: 75000,
    department: 'Engineering',
    active: false,
  },
  {
    id: 4,
    name: 'Alice Brown',
    age: 28,
    salary: 55000,
    department: 'Sales',
    active: true,
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    age: 32,
    salary: 70000,
    department: 'Marketing',
    active: true,
  },
];

export const mockCsvString = `id,name,age,salary,department,active
1,John Doe,25,50000,Engineering,true
2,Jane Smith,30,65000,Marketing,true
3,Bob Johnson,35,75000,Engineering,false
4,Alice Brown,28,55000,Sales,true
5,Charlie Wilson,32,70000,Marketing,true`;

export const mockFile = new File([mockCsvString], 'test-data.csv', {
  type: 'text/csv',
});

export const mockInsights = [
  {
    title: 'Average Salary',
    description: 'The average salary across all employees is $63,000',
    type: 'trend' as const,
    confidence: 'High',
    column: 'salary',
    value: '$63,000',
  },
  {
    title: 'Department Distribution',
    description: 'Engineering has the highest representation with 40% of employees',
    type: 'correlation' as const,
    confidence: 'Medium',
    column: 'department',
  },
  {
    title: 'Age Range',
    description: 'Employee ages range from 25 to 35 years',
    type: 'outlier' as const,
    confidence: 'High',
    column: 'age',
    value: '25-35 years',
  },
];