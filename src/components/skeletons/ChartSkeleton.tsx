import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ChartSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className={`space-y-6 ${count > 1 ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="bg-muted rounded h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col justify-end space-y-2">
              {/* Simulate bar chart skeleton */}
              <div className="flex items-end justify-around h-full gap-2">
                {[60, 80, 45, 90, 70, 55, 85, 40].map((height, idx) => (
                  <div
                    key={idx}
                    className="bg-muted rounded-t flex-1"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              {/* X-axis line */}
              <div className="bg-muted rounded h-1 w-full" />
              {/* X-axis labels */}
              <div className="flex justify-around">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
                  <div key={idx} className="bg-muted rounded h-3 w-8" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PieChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="bg-muted rounded h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          {/* Simulate pie chart */}
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-muted rounded-full" />
            <div className="absolute inset-8 bg-background rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LineChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="bg-muted rounded h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col justify-end space-y-2">
          {/* Simulate line chart with zigzag pattern */}
          <div className="relative h-full">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M 0 150 L 50 120 L 100 140 L 150 80 L 200 100 L 250 60 L 300 90 L 350 70 L 400 100"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-muted"
              />
            </svg>
          </div>
          {/* Axis */}
          <div className="bg-muted rounded h-1 w-full" />
          <div className="flex justify-around">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
              <div key={idx} className="bg-muted rounded h-3 w-8" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
