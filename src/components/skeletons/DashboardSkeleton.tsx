import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonCard, SkeletonLine, SkeletonButton, SkeletonCircle } from "./SkeletonCard";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2 flex-1">
          <div className="bg-muted rounded h-8 w-64 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="bg-muted rounded h-4 w-32 animate-pulse" />
            <div className="bg-muted rounded h-4 w-20 animate-pulse" />
            <div className="bg-muted rounded h-4 w-24 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonButton className="w-32" />
          <SkeletonButton className="w-32" />
          <SkeletonButton className="w-32" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="bg-muted rounded h-4 w-24" />
              <SkeletonCircle size="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded h-8 w-20 mb-2" />
              <div className="bg-muted rounded h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-muted rounded-t h-10 w-24 animate-pulse" />
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
      </div>
    </div>
  );
}
