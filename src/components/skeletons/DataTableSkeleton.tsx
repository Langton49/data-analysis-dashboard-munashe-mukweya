import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DataTableSkeleton({ rows = 10, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="bg-muted rounded h-6 w-32" />
          <div className="bg-muted rounded h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="bg-muted rounded h-10 flex items-center px-4">
                <div className="bg-muted-foreground/20 rounded h-4 w-full" />
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <div key={colIdx} className="bg-muted/50 rounded h-12 flex items-center px-4">
                  <div className="bg-muted rounded h-4 w-3/4" />
                </div>
              ))}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between items-center pt-4">
            <div className="bg-muted rounded h-4 w-32" />
            <div className="flex gap-2">
              <div className="bg-muted rounded h-9 w-20" />
              <div className="bg-muted rounded h-9 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
