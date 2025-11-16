# 🧪 Testing Guide

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   ├── utils/
│   │   └── test-utils.tsx     # Custom render function with providers
│   ├── mocks/
│   │   └── recharts.ts        # Mock chart components
│   └── fixtures/
│       └── mockData.ts        # Test data fixtures
├── components/
│   └── __tests__/             # Component tests
├── pages/
│   └── __tests__/             # Page tests
├── utils/
│   └── __tests__/             # Utility function tests
└── lib/
    └── __tests__/             # Library function tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test DataUpload.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should render"
```

## Test Categories

### 1. Unit Tests
- **Utils**: `src/utils/__tests__/`
- **Lib**: `src/lib/__tests__/`
- Test individual functions and utilities

### 2. Component Tests
- **Components**: `src/components/__tests__/`
- Test component rendering, user interactions, and props

### 3. Integration Tests
- **Pages**: `src/pages/__tests__/`
- Test complete page functionality and component integration

## Test Utilities

### Custom Render
Use the custom render function that includes all providers:

```typescript
import { render, screen } from '../../test/utils/test-utils';

test('component renders correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Mock Data
Use predefined mock data for consistent testing:

```typescript
import { mockCsvData, mockInsights } from '../../test/fixtures/mockData';

test('processes data correctly', () => {
  const result = processData(mockCsvData);
  expect(result).toHaveLength(5);
});
```

### User Interactions
Use `@testing-library/user-event` for realistic user interactions:

```typescript
import userEvent from '@testing-library/user-event';

test('handles button click', async () => {
  const user = userEvent.setup();
  render(<Button onClick={mockFn}>Click me</Button>);
  
  await user.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees and does
   - Avoid testing internal component state

2. **Use Semantic Queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

3. **Mock External Dependencies**
   - Mock API calls, chart libraries, etc.
   - Keep tests fast and reliable

4. **Write Descriptive Test Names**
   - Use "should" statements
   - Be specific about the expected behavior

5. **Test Accessibility**
   - Verify ARIA labels and roles
   - Test keyboard navigation
   - Check screen reader compatibility

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Focus on testing critical paths and user interactions rather than achieving 100% coverage.