
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
            <div className="flex items-center justify-center mb-6" role="img" aria-label="Data Visualizer logo">
              <div className="bg-gray-900 dark:bg-gray-100 p-4 rounded-lg">
                <Database className="h-12 w-12 text-white dark:text-gray-900" aria-hidden="true" />
              </div>
            </div>
            
            {/* 📝 WEEK 1: Students customize this title with their name */}
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              Data Visualizer
            </h1>
            <p className="text-xl font-light text-gray-500 dark:text-gray-400 mb-2" role="doc-subtitle">Interactive Data Analysis</p>
            <p className="text-lg font-light text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your dataset and instantly discover insights, visualize trends, and explore your data with interactive charts and analytics.
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
            {/* 🎨 Features Grid - Shows what your app can do */}
            <section aria-label="Features" className="grid md:grid-cols-3 gap-4 mb-12">
                {/* 📤 Upload Feature Card */}
                <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors" role="article">
                  <CardHeader className="text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" role="img" aria-label="Upload icon">
                      <Upload className="h-8 w-8 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-light">Easy Data Upload</CardTitle>
                    <CardDescription className="font-light">
                      Simply drag and drop your CSV files or click to browse. Support for various data formats.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* 📊 Charts Feature Card */}
                <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors" role="article">
                  <CardHeader className="text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" role="img" aria-label="Charts icon">
                      <BarChart3 className="h-8 w-8 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-light">Interactive Charts</CardTitle>
                    <CardDescription className="font-light">
                      Automatically generate bar charts, line graphs, pie charts, and more from your data.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* 🧠 Insights Feature Card */}
                <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors" role="article">
                  <CardHeader className="text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" role="img" aria-label="Insights icon">
                      <TrendingUp className="h-8 w-8 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-light">Smart Insights</CardTitle>
                    <CardDescription className="font-light">
                      Discover patterns, trends, and statistical insights automatically generated from your dataset.
                    </CardDescription>
                  </CardHeader>
                </Card>
            </section>

            {/* 📤 Upload Section - Where users upload their data */}
            <section aria-label="Data upload" className="max-w-2xl mx-auto">
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-light">Get Started</CardTitle>
                    <CardDescription className="font-light">
                      Upload your CSV file to begin exploring your data
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
