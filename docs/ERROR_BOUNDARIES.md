# Error Boundary Implementation

This app uses error boundaries to gracefully handle runtime errors and provide a better user experience.

## What's Protected

### App-Level Protection
- The entire app is wrapped in an error boundary that catches catastrophic errors
- If something breaks at the app level, users see a friendly error screen with options to retry or go home

### Route-Level Protection
- All routes are wrapped in an error boundary
- If a page fails to load, users get a clear message without crashing the entire app

### Component-Level Protection
- Critical components like `Dashboard` and `DataUpload` have their own error boundaries
- If these components fail, only that section shows an error, not the whole page

## Error Messages

All error messages are user-friendly and don't expose:
- Stack traces
- Internal implementation details
- Sensitive system information
- Technical jargon

Users only see:
- What went wrong in simple terms
- What they can do about it (retry, go home, etc.)

## Components

### ErrorBoundary.tsx
Class-based error boundary component for maximum compatibility.

### ErrorFallback.tsx
Two fallback UI components:
- `ErrorFallback`: Full-page error display
- `InlineErrorFallback`: Compact error display for component-level errors

## Usage Examples

### Wrapping a component:
```tsx
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => window.location.reload()}
>
  <YourComponent />
</ErrorBoundary>
```

### Inline error with custom message:
```tsx
<ErrorBoundary
  FallbackComponent={(props) => (
    <InlineErrorFallback {...props} message="Custom error message" />
  )}
  onReset={handleReset}
>
  <YourComponent />
</ErrorBoundary>
```

## Testing

To test error boundaries, you can temporarily throw an error in a component:
```tsx
throw new Error('Test error');
```

Remember to remove test errors before committing!
