// ==========================================
// 🎯 WEEK 1: App.tsx - Main Application Setup
// ==========================================
// This is the root component of your React application!
// Think of this as the foundation of your house - everything starts here.

// 📦 Import statements - bringing in the tools we need
import { Suspense, lazy } from "react"; // For code splitting and lazy loading
import { Toaster } from "@/components/ui/toaster"; // For showing notifications
import { Toaster as Sonner } from "@/components/ui/sonner"; // Alternative notification system
import { TooltipProvider } from "@/components/ui/tooltip"; // For helpful hover tips
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // For data management
import { BrowserRouter, Routes, Route } from "react-router-dom"; // For navigation between pages
import { ErrorBoundary } from "react-error-boundary"; // For graceful error handling
import { ErrorFallback } from "./components/ErrorFallback"; // Custom error UI
import { StartScreenSkeleton } from "./components/skeletons"; // Loading fallback

// 🚀 Code Splitting: Lazy load pages for better initial load performance
// Main pages - loaded on demand
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Demo pages - loaded only when accessed
const DemoCounter = lazy(() => import("./pages/DemoCounter"));
const LiveSession = lazy(() => import("./pages/LiveSession"));
const Week3Live = lazy(() => import("./pages/Week3Live"));
const Week4LiveDemo = lazy(() => import("./components/Demos/Week4LiveDemo"));
const Week5Live = lazy(() => import("./components/Demos/Week5Live"));
const Week6Live = lazy(() => import("./components/Demos/Week6Live"));
const Week8Live = lazy(() => import("./components/Demos/Week8Live"));
const BrokenDemo = lazy(() => import("./pages/BrokenDemo"));
const BrokenDemoSolution = lazy(() => import("./pages/BrokenDemoSolution"));

// Create a client for managing data queries (don't worry about this yet!)
const queryClient = new QueryClient();

// Import skip link component
import { SkipLink } from "./components/SkipLink";
import { ThemeProvider } from "./components/ThemeProvider";

// 🚀 Main App Component - This wraps your entire application
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* Skip link for keyboard navigation */}
            <SkipLink />
            
            {/* These Toaster components handle popup notifications */}
            <Toaster />
            <Sonner />

          {/* 🧭 Router setup - manages which page to show */}
          <BrowserRouter>
            <ErrorBoundary
              FallbackComponent={(props) => (
                <ErrorFallback {...props} message="Unable to load this page. Please try again." />
              )}
              onReset={() => window.location.reload()}
            >
              {/* Suspense wrapper for lazy-loaded routes */}
              <Suspense fallback={<StartScreenSkeleton />}>
                <Routes>
                  {/* 🏠 Main route - shows your homepage */}
                  <Route path="/" element={<Index />} />

                  {/* 🎓 Instructor demo route - for live useState demonstrations */}
                  <Route path="/demo-counter" element={<DemoCounter />} />

                  {/* 🎮 Live session playground - interactive React examples */}
                  <Route path="/live-session" element={<LiveSession />} />

                  {/* 🎯 Week 3 live playground - interactive components & user input */}
                  <Route path="/week3-live" element={<Week3Live />} />

                  {/* 🔧 WEEK 4+ */}
                  <Route path="/week4-live" element={<Week4LiveDemo />} />

                  {/* Week 5 live playground - interactive components & user input */}
                  <Route path="/week5-live" element={<Week5Live />} />

                  <Route path="/week6-live" element={<Week6Live />} />

                  {/* 🔍 Week 9: Quality Detective Challenge */}
                  <Route path="/broken-demo" element={<BrokenDemo />} />
                  <Route
                    path="/broken-demo-solution"
                    element={<BrokenDemoSolution />}
                  />

                  <Route path="/week8-live" element={<Week8Live />} />

                  {/* ⚠️ Catch-all route - shows 404 for unknown URLs */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
