import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonCircle } from "./SkeletonCard";

export function StartScreenSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Theme toggle skeleton */}
        <div className="flex justify-end mb-4">
          <div className="bg-muted rounded h-10 w-10 animate-pulse" />
        </div>
        
        {/* Header skeleton */}
        <header className="text-center mb-12">
          {/* Logo skeleton */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-muted p-4 rounded-lg animate-pulse">
              <SkeletonCircle size="h-12 w-12" />
            </div>
          </div>
          
          {/* Title skeleton */}
          <div className="bg-muted rounded h-12 w-80 mx-auto mb-4 animate-pulse" />
          <div className="bg-muted rounded h-6 w-64 mx-auto mb-2 animate-pulse" />
          <div className="bg-muted rounded h-5 w-96 mx-auto animate-pulse" />
        </header>

        <main>
          {/* Features Grid skeleton */}
          <section className="grid md:grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-gray-200 dark:border-gray-800 animate-pulse">
                <CardHeader className="text-center">
                  <div className="bg-muted w-16 h-16 rounded-lg mx-auto mb-4" />
                  <div className="bg-muted rounded h-6 w-32 mx-auto mb-2" />
                  <div className="space-y-2">
                    <div className="bg-muted rounded h-4 w-full" />
                    <div className="bg-muted rounded h-4 w-5/6 mx-auto" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </section>

          {/* Upload Section skeleton */}
          <section className="max-w-2xl mx-auto">
            <Card className="border-gray-200 dark:border-gray-800 animate-pulse">
              <CardHeader className="text-center">
                <div className="bg-muted rounded h-6 w-32 mx-auto mb-2" />
                <div className="bg-muted rounded h-4 w-48 mx-auto" />
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <SkeletonCircle size="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-2 text-center w-full">
                      <div className="bg-muted rounded h-5 w-48 mx-auto" />
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
          </section>
        </main>
      </div>
    </div>
  );
}