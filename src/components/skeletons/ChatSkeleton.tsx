import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonCircle } from "./SkeletonCard";

export function ChatSkeleton() {
  return (
    <Card className="h-[600px] flex flex-col animate-pulse">
      <CardHeader>
        <div className="flex items-center gap-2">
          <SkeletonCircle size="h-5 w-5" />
          <div className="bg-muted rounded h-6 w-48" />
        </div>
        <div className="bg-muted rounded h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden space-y-4 mb-4">
          {/* Welcome message skeleton */}
          <div className="text-center py-8 space-y-4">
            <SkeletonCircle size="h-12 w-12 mx-auto" />
            <div className="bg-muted rounded h-5 w-48 mx-auto" />
            <div className="bg-muted rounded h-4 w-32 mx-auto" />
            <div className="space-y-2 max-w-md mx-auto mt-4">
              <div className="bg-muted rounded h-8 w-full" />
              <div className="bg-muted rounded h-8 w-full" />
              <div className="bg-muted rounded h-8 w-full" />
            </div>
          </div>
        </div>

        {/* Input area skeleton */}
        <div className="flex gap-2">
          <div className="flex-1 bg-muted rounded h-[60px]" />
          <div className="bg-muted rounded h-[60px] w-[60px]" />
        </div>
        
        <div className="bg-muted rounded h-4 w-64 mx-auto mt-2" />
      </CardContent>
    </Card>
  );
}

export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-pulse`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <SkeletonCircle size="w-8 h-8" />
        <div className="bg-muted rounded-lg p-3 space-y-2 min-w-[200px]">
          <div className="bg-muted-foreground/20 rounded h-4 w-full" />
          <div className="bg-muted-foreground/20 rounded h-4 w-3/4" />
          <div className="bg-muted-foreground/20 rounded h-3 w-16 mt-2" />
        </div>
      </div>
    </div>
  );
}
