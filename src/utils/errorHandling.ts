// Utility functions for error handling

/**
 * Wraps an async function to catch errors and provide user-friendly messages
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.error('Error in async operation:', error);
    return fallback;
  }
}


export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (error.message.includes('parse') || error.message.includes('JSON')) {
      return 'Unable to process the data. Please check the file format.';
    }
    if (error.message.includes('permission') || error.message.includes('denied')) {
      return 'Permission denied. Please check your access rights.';
    }
  }
  
  return 'Something went wrong. Please try again.';
}


export function logError(error: unknown, context?: string) {
  const prefix = context ? `[${context}]` : '';
  console.error(`${prefix} Error:`, error);
  
}
