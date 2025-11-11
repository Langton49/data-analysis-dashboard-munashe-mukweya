import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonCircle } from "./SkeletonCard";

export function UploadSkeleton() {
  return (
    <Card className="border-gray-200 dark:border-gray-800 animate-pulse">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SkeletonCircle size="h-6 w-6" />
          <div className="bg-muted rounded h-6 w-40" />
        </div>
        <div className="bg-muted rounded h-4 w-3/4 mx-auto" />
      </CardHeader>
      
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <SkeletonCircle size="h-8 w-8" />
            </div>
            
            <div className="space-y-2 text-center w-full">
              <div className="bg-muted rounded h-6 w-48 mx-auto" />
              <div className="bg-muted rounded h-4 w-64 mx-auto" />
            </div>

            <div className="bg-muted rounded h-10 w-32" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2 text-center">
            <div className="bg-muted rounded h-3 w-full" />
            <div className="bg-muted rounded h-3 w-5/6 mx-auto" />
            <div className="bg-muted rounded h-3 w-4/6 mx-auto" />
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="bg-muted rounded h-4 w-32" />
            <div className="bg-muted rounded h-16 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UploadProgressSkeleton() {
  return (
    <Card className="border-gray-200 dark:border-gray-800 animate-pulse">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SkeletonCircle size="h-6 w-6" />
          <div className="bg-muted rounded h-6 w-40" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
            </div>
            
            <div className="space-y-2 text-center w-full">
              <div className="bg-muted rounded h-6 w-48 mx-auto" />
              <div className="bg-muted rounded h-4 w-64 mx-auto" />
            </div>

            <div className="w-full max-w-xs space-y-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-full overflow-hidden">
                <div className="bg-gray-900 dark:bg-gray-100 h-full w-2/3 animate-pulse" />
              </div>
              <div className="bg-muted rounded h-3 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
