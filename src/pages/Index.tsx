
// ==========================================
// 🏠 WEEK 1: Index.tsx - Homepage Component
// ==========================================
// This is your main homepage! You will customize this in Week 1
// and add interactive components starting in Week 2.

// 📦 React imports - the core tools for building components
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 🎨 Icon imports - beautiful icons for your UI
import { Upload, BarChart3, PieChart, TrendingUp, Database } from 'lucide-react';

// Theme toggle
import { ThemeToggle } from '@/components/ThemeToggle';

// 🧩 UI Component imports - pre-built components for your interface
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// 📊 Data-related imports - components that handle your data
import DataUpload from '@/components/DataUpload';
import Dashboard from '@/components/Dashboard';
import { DataRow } from '@/types/data';
import { InlineErrorFallback } from '@/components/ErrorFallback';
// 🆕 WEEK 3: Import NameInput demo
// import NameInput from '@/components/NameInput';

// 🔧 WEEK 2: Import your UploadProgressSimulator component here
// 🔧 WEEK 3+: Additional imports will be added as you progress

const Index = () => {
  // 🧠 Component State - this is your component's memory!
  // useState lets your component remember and change data
  const [data, setData] = useState<DataRow[]>([]);      // Stores uploaded data
  const [fileName, setFileName] = useState<string>(''); // Remembers file name

  // 🔄 Event Handler - function that runs when data is uploaded
  const handleDataLoad = (loadedData: DataRow[], name: string) => {
    setData(loadedData);
    setFileName(name);
    console.log('Data loaded:', loadedData.length, 'rows');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {data.length === 0 ? (
        /* 🎨 Hero Section - The top part of your homepage */
        <div className="container mx-auto px-4 py-8">
          {/* Theme toggle in top right */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          
          <header className="text-center mb-12">
            {/* 🎯 Logo and Title */}
            <div className="flex items-center justify-center mb-6" role="img" aria-label="Stock Market Analyzer logo">
              <div className="bg-gradient-to-br from-green-600 to-blue-600 p-4 rounded-lg shadow-lg">
                <TrendingUp className="h-12 w-12 text-white" aria-hidden="true" />
              </div>
            </div>
            
            {/* 📝 Professional Stock Analysis Platform */}
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              Stock Market Analyzer
            </h1>
            <p className="text-xl font-light text-gray-500 dark:text-gray-400 mb-2" role="doc-subtitle">Professional Stock Analysis Platform</p>
            <p className="text-lg font-light text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Upload historical stock data and get comprehensive market analysis with interactive OHLC charts, volume analysis, and AI-powered investment insights.
            </p>
            {/* 🆕 WEEK 3: Live Event Handling Demo (removed NameInput from homepage) */}
            {/* <div className="mt-8 mb-8 flex justify-center">
              <NameInput />
            </div> */}

            {/* 🔧 WEEK 2: ADD YOUR PROGRESS COMPONENT HERE! */}
            {/* This is where students will add their UploadProgressSimulator component */}
            {/* Example: */}
            {/* <div className="mb-8">
              <UploadProgressSimulator />
            </div> */}
          </header>

          <main id="main-content" tabIndex={-1}>
            {/* 📚 Quick Tutorial Section */}
            <section aria-label="How to use" className="mb-12 max-w-4xl mx-auto">
              <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-light mb-2">How to Use Stock Market Analyzer</CardTitle>
                  <CardDescription className="font-light text-base">
                    Get professional stock analysis in 3 simple steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-700 dark:text-blue-300 font-semibold">1</span>
                      </div>
                      <h3 className="font-medium mb-2">Upload Stock Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload a CSV file with historical stock data including Date, Price, Open, High, Low, Volume, and Change%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-700 dark:text-green-300 font-semibold">2</span>
                      </div>
                      <h3 className="font-medium mb-2">Explore Charts</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        View OHLC analysis, volume trends, price movements, and daily returns with full-screen capabilities
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-700 dark:text-purple-300 font-semibold">3</span>
                      </div>
                      <h3 className="font-medium mb-2">Get AI Insights</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chat with AI to get investment insights, trend analysis, and market recommendations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 🎨 Features Grid - Shows what your app can do */}
            <section aria-label="Features" className="grid md:grid-cols-3 gap-4 mb-12">
                {/* 📤 Stock Data Upload Feature Card */}
                <Card className="border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-colors" role="article">
                  <CardHeader className="text-center">
                    <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" role="img" aria-label="Upload icon">
                      <Upload className="h-8 w-8 text-green-700 dark:text-green-300" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-light">Historical Stock Data</CardTitle>
                    <CardDescription className="font-light">
                      Upload CSV files with Date, Price, Open, High, Low, Volume, and Change% columns for comprehensive analysis.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* 📊 Stock Charts Feature Card */}
                <Card className="border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors" role="article">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" role="img" aria-label="Charts icon">
                      <BarChart3 className="h-8 w-8 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-light">Professional Stock Charts</CardTitle>
                    <CardDescription className="font-light">
                      OHLC analysis, volume charts, price trends, and daily returns with full-screen viewing and interactive controls.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* 🧠 Investment Insights Feature Card */}
                <Card className="border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors" role="article">
                  <CardHeader className="text-center">
                    <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" role="img" aria-label="Insights icon">
                      <TrendingUp className="h-8 w-8 text-purple-700 dark:text-purple-300" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-light">AI Investment Insights</CardTitle>
                    <CardDescription className="font-light">
                      Get intelligent market analysis, trend predictions, and investment recommendations powered by advanced AI.
                    </CardDescription>
                  </CardHeader>
                </Card>
            </section>

            {/* 📤 Upload Section - Where users upload their stock data */}
            <section aria-label="Stock data upload" className="max-w-2xl mx-auto">
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-light">Start Your Analysis</CardTitle>
                    <CardDescription className="font-light">
                      Upload your historical stock data CSV file to begin professional market analysis
                      <br />
                      <span className="text-xs text-gray-400 mt-2 block">
                        Expected columns: Date, Price, Open, High, Low, Vol., Change%
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <InlineErrorFallback {...props} message="Unable to load file uploader. Please refresh the page." />
                      )}
                    >
                      <DataUpload onDataLoad={handleDataLoad} />
                    </ErrorBoundary>
                  </CardContent>
                </Card>
            </section>
          </main>
        </div>
      ) : (
        <ErrorBoundary
          FallbackComponent={(props) => (
            <InlineErrorFallback {...props} message="Unable to display dashboard. Please try uploading your data again." />
          )}
          onReset={() => {
            setData([]);
            setFileName('');
          }}
        >
          <Dashboard data={data} fileName={fileName} onReset={() => {
            setData([]);
            setFileName('');
          }} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Index;
