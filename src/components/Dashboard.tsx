
// ==========================================
// 📊 WEEK 4+: Dashboard.tsx - Main Data Visualization Component
// ==========================================
// This is the main dashboard that displays after data is uploaded
// Students will enhance this component throughout weeks 4-10

import { useState, useMemo, useEffect } from 'react';
import { Download, BarChart3, Table as TableIcon, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow } from '@/types/data';
import DataTable from './DataTable';
import ChartSection from './ChartSection';
import InsightsPanel from './InsightsPanel';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import { generateDataInsights, getDataSummary } from '@/utils/dataAnalysis';
import { DashboardSkeleton } from './skeletons';

// 🔧 WEEK 6: Import custom chart components here
// Example: import CustomChartBuilder from './CustomChartBuilder';

// 🔧 WEEK 8: Import personal data analysis components here  
// Example: import PersonalAnalytics from './PersonalAnalytics';

// 🔧 WEEK 9: Import AI components here
// Example: import AIInsightGenerator from './AIInsightGenerator';

interface DashboardProps {
  data: DataRow[];
  fileName: string;
  onReset: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const Dashboard = ({ data, fileName, onReset }: DashboardProps) => {
  // 🧠 Dashboard state management
  const [activeTab, setActiveTab] = useState('overview');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // 💬 Persistent chat state - maintained across tab switches
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'system' | 'user' | 'assistant'; content: string }>>([]);
  
  // 🔍 Persistent AI insights state - maintained across tab switches
  const [aiInsights, setAiInsights] = useState<{ summary: string; anomalies: string[] } | undefined>(undefined);
  
  // 🔧 WEEK 4: Add data processing state here
  // Example: const [filteredData, setFilteredData] = useState(data);
  
  // 🔧 WEEK 5: Add file handling state here
  // Example: const [exportFormat, setExportFormat] = useState('csv');
  
  // 🔧 WEEK 6: Add chart customization state here
  // Example: const [chartConfig, setChartConfig] = useState({});
  
  // 🔧 WEEK 7: Add API integration state here
  // Example: const [externalData, setExternalData] = useState([]);
  
  // 🔧 WEEK 8: Add personal analytics state here
  // Example: const [personalInsights, setPersonalInsights] = useState([]);
  
  // 🔧 WEEK 9: Add AI insights state here
  // Example: const [aiGeneratedInsights, setAiGeneratedInsights] = useState([]);

  // 📊 Computed values - these recalculate when data changes
  const summary = useMemo(() => getDataSummary(data), [data]);
  const insights = useMemo(() => generateDataInsights(data), [data]);

  // Simulate initial data processing
  useEffect(() => {
    setIsInitializing(true);
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 800); // Short delay to show skeleton
    return () => clearTimeout(timer);
  }, [data]);

  // Show skeleton during initialization
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Enhanced export functionality
  const handleExportCSV = () => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${fileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportInsights = () => {
    const reportContent = `Data Analysis Report
Generated: ${new Date().toLocaleDateString()}
Dataset: ${fileName}

DATASET SUMMARY
================
Total Rows: ${summary.totalRows.toLocaleString()}
Total Columns: ${summary.totalColumns}
Numeric Columns: ${summary.numericColumns}
Text Columns: ${summary.textColumns}

KEY INSIGHTS
=============
${insights.map((insight, index) => 
  `${index + 1}. ${insight.title}
   ${insight.description}
   Confidence: ${insight.confidence}
   ${insight.column ? `Column: ${insight.column}` : ''}
`).join('\n')}

MISSING DATA
=============
${Object.entries(summary.missingValues)
  .filter(([_, count]) => count > 0)
  .map(([column, count]) => `${column}: ${count} missing values (${(count/summary.totalRows*100).toFixed(1)}%)`)
  .join('\n') || 'No missing data detected'}

COLUMN TYPES
=============
${Object.entries(summary.columnTypes)
  .map(([column, type]) => `${column}: ${type}`)
  .join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insights_${fileName.replace('.csv', '')}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        fileName={fileName}
        onReset={onReset}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-gray-100">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleExportCSV} 
                className="font-light"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleExportInsights}
                className="font-light"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-light">
            <span>{data.length.toLocaleString()} rows</span>
            <span>•</span>
            <span>{Object.keys(data[0] || {}).length} columns</span>
            <span>•</span>
            <span>{summary.numericColumns} numeric</span>
            <span>•</span>
            <span>
              {Object.values(summary.missingValues).every(count => count === 0) ? '100%' : 
               `${(100 - (Object.values(summary.missingValues).reduce((a, b) => a + b, 0) / (summary.totalRows * summary.totalColumns) * 100)).toFixed(1)}%`} complete
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Minimalist Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-light text-gray-500 dark:text-gray-400">Total Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light">{summary.totalRows.toLocaleString()}</div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-light text-gray-500 dark:text-gray-400">Columns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light">{summary.totalColumns}</div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-light text-gray-500 dark:text-gray-400">Numeric</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light">{summary.numericColumns}</div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-light text-gray-500 dark:text-gray-400">Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light">
                      {Object.values(summary.missingValues).every(count => count === 0) ? '100%' : 
                       `${(100 - (Object.values(summary.missingValues).reduce((a, b) => a + b, 0) / (summary.totalRows * summary.totalColumns) * 100)).toFixed(1)}%`}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Insights */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ChartSection data={data} />
                </div>
                <div className="xl:col-span-1">
                  <InsightsPanel 
                    data={data} 
                    insights={insights.slice(0, 6)}
                    aiInsights={aiInsights}
                    onAiInsightsChange={setAiInsights}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'charts' && <ChartSection data={data} showAll />}
          {activeTab === 'insights' && (
            <InsightsPanel 
              data={data} 
              insights={insights} 
              showAll 
              aiInsights={aiInsights}
              onAiInsightsChange={setAiInsights}
            />
          )}
          {activeTab === 'chat' && (
            <ChatInterface 
              data={data}
              messages={chatMessages}
              conversationHistory={chatHistory}
              onMessagesChange={setChatMessages}
              onHistoryChange={setChatHistory}
            />
          )}
          {activeTab === 'data' && <DataTable data={data} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
