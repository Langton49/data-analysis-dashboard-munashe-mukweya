import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonCard, SkeletonLine, SkeletonButton, SkeletonCircle } from "./SkeletonCard";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Skeleton */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-screen">
        <div className="p-6 space-y-6">
          {/* Logo/Header */}
          <div className="space-y-2">
            <div className="bg-muted rounded h-6 w-32 animate-pulse" />
            <div className="bg-muted rounded h-4 w-40 animate-pulse" />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <SkeletonCircle size="h-5 w-5" />
                <div className="bg-muted rounded h-4 w-24 animate-pulse" />
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="bg-muted rounded h-10 w-full animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 ml-64 p-8 bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-muted rounded h-8 w-48 animate-pulse" />
            <div className="flex gap-2">
              <SkeletonButton className="w-32" />
              <SkeletonButton className="w-32" />
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-4">
            <div className="bg-muted rounded h-4 w-20 animate-pulse" />
            <div className="bg-muted rounded h-4 w-1 animate-pulse" />
            <div className="bg-muted rounded h-4 w-24 animate-pulse" />
            <div className="bg-muted rounded h-4 w-1 animate-pulse" />
            <div className="bg-muted rounded h-4 w-20 animate-pulse" />
            <div className="bg-muted rounded h-4 w-1 animate-pulse" />
            <div className="bg-muted rounded h-4 w-24 animate-pulse" />
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-gray-200 dark:border-gray-800 animate-pulse">
              <CardHeader className="pb-3">
                <div className="bg-muted rounded h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Area Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <SkeletonCard contentHeight="h-[300px]" />
          </div>
          <div className="xl:col-span-1">
            <SkeletonCard rows={4} contentHeight="h-20" />
          </div>
        </div>
      </main>
    </div>
  );
}
