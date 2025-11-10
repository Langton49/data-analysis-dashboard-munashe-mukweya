import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
}

export function ErrorFallback({ error, resetErrorBoundary, message }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Oops!</CardTitle>
          <CardDescription className="text-base mt-2">
            {message || 'Something went wrong. Please try again.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {resetErrorBoundary && (
              <Button 
                onClick={resetErrorBoundary} 
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button 
              onClick={handleGoHome} 
              className="flex-1"
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InlineErrorFallback({ error, resetErrorBoundary, message }: ErrorFallbackProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">
              {message || 'Unable to load this section'}
            </p>
            {resetErrorBoundary && (
              <Button 
                onClick={resetErrorBoundary} 
                variant="link" 
                className="h-auto p-0 text-red-700 hover:text-red-900 mt-1"
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
