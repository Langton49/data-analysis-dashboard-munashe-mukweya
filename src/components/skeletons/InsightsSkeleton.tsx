import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonCircle } from "./SkeletonCard";

export function InsightsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="bg-muted rounded h-6 w-32" />
          <SkeletonCircle size="h-5 w-5" />
        </div>
        <div className="bg-muted rounded h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="border-l-4 border-muted pl-4 py-3 space-y-2">
              <div className="flex items-start gap-3">
                <SkeletonCircle size="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <div className="bg-muted rounded h-5 w-3/4" />
                  <div className="bg-muted rounded h-4 w-full" />
                  <div className="bg-muted rounded h-4 w-5/6" />
                  <div className="flex gap-2 mt-2">
                    <div className="bg-muted rounded h-6 w-20" />
                    <div className="bg-muted rounded h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightCardSkeleton() {
  return (
    <div className="border-l-4 border-muted pl-4 py-3 space-y-2 animate-pulse">
      <div className="flex items-start gap-3">
        <SkeletonCircle size="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <div className="bg-muted rounded h-5 w-3/4" />
          <div className="bg-muted rounded h-4 w-full" />
          <div className="bg-muted rounded h-4 w-5/6" />
          <div className="flex gap-2 mt-2">
            <div className="bg-muted rounded h-6 w-20" />
            <div className="bg-muted rounded h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
