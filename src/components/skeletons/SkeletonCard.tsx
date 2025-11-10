import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  showHeader?: boolean;
  headerHeight?: string;
  contentHeight?: string;
  rows?: number;
}

export function SkeletonCard({ 
  className, 
  showHeader = true, 
  headerHeight = "h-6",
  contentHeight = "h-32",
  rows = 1
}: SkeletonCardProps) {
  return (
    <Card className={cn("animate-pulse", className)}>
      {showHeader && (
        <CardHeader>
          <div className={cn("bg-muted rounded", headerHeight, "w-3/4")} />
          <div className="bg-muted rounded h-4 w-1/2 mt-2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={cn("bg-muted rounded", contentHeight)} />
        ))}
      </CardContent>
    </Card>
  );
}

export function SkeletonLine({ className, width = "w-full" }: { className?: string; width?: string }) {
  return <div className={cn("bg-muted rounded h-4 animate-pulse", width, className)} />;
}

export function SkeletonCircle({ size = "h-12 w-12" }: { size?: string }) {
  return <div className={cn("bg-muted rounded-full animate-pulse", size)} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <div className={cn("bg-muted rounded h-10 w-24 animate-pulse", className)} />;
}
