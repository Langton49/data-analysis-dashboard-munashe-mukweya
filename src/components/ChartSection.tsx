import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { DataRow } from '@/types/data';
import { getDataSummary } from '@/utils/dataAnalysis';
import { ChartSkeleton } from './skeletons';
import { TrendingUp, BarChart3, Activity, DollarSign, Maximize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw, BarChart2 } from 'lucide-react';
import FullScreenChart from './FullScreenChart';
import { CandlestickChart } from './CandlestickChart';

interface ChartSectionProps {
  data: DataRow[];
  showAll?: boolean;
}

// Enhanced color palettes for better distinction and stock market themes
const COLORS_LIGHT = [
  '#2563eb', // Blue - Primary trend line
  '#dc2626', // Red - Bearish/negative
  '#16a34a', // Green - Bullish/positive  
  '#ea580c', // Orange - Volume/secondary
  '#7c3aed', // Purple - Additional data
  '#0891b2', // Cyan - Support lines
  '#be185d', // Pink - Resistance lines
  '#4338ca'  // Indigo - Extra data points
];

const COLORS_DARK = [
  '#3b82f6', // Lighter Blue - Primary trend line
  '#ef4444', // Lighter Red - Bearish/negative
  '#22c55e', // Lighter Green - Bullish/positive
  '#f97316', // Lighter Orange - Volume/secondary
  '#8b5cf6', // Lighter Purple - Additional data
  '#06b6d4', // Lighter Cyan - Support lines
  '#ec4899', // Lighter Pink - Resistance lines
  '#6366f1'  // Lighter Indigo - Extra data points
];

// Stock-specific colors for financial data
const STOCK_COLORS = {
  bullish: '#16a34a',      // Green for positive/gains
  bearish: '#dc2626',      // Red for negative/losses
  neutral: '#6b7280',      // Gray for neutral
  volume: '#0891b2',       // Cyan for volume
  price: '#2563eb',        // Blue for price
  support: '#22c55e',      // Light green for support
  resistance: '#ef4444',   // Light red for resistance
  trend: '#7c3aed'         // Purple for trend lines
};

const ChartSection = ({ data, showAll = false }: ChartSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fullScreenChart, setFullScreenChart] = useState<string | null>(null);

  // Chart windowing state for performance
  const [windowSize, setWindowSize] = useState(10); // Default to last 10 records
  const [windowStart, setWindowStart] = useState(-1); // -1 means "show last N records", >=0 means specific position

  // Debug logging
  useEffect(() => {
    console.log('ChartSection state:', { windowSize, windowStart, dataLength: data.length });
  }, [windowSize, windowStart, data.length]);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const COLORS = isDarkMode ? COLORS_DARK : COLORS_LIGHT;

  // Dynamic styles for dark mode
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const axisColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [data, showAll]);

  const summary = useMemo(() => getDataSummary(data), [data]);

  // Check if this is stock data by looking for expected columns
  const isStockData = useMemo(() => {
    const columns = Object.keys(data[0] || {});
    const stockColumns = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change%'];
    return stockColumns.some(col => columns.includes(col));
  }, [data]);

  // Get stock-specific columns
  const stockColumns = useMemo(() => {
    if (!isStockData) return {};
    const columns = Object.keys(data[0] || {});
    return {
      date: columns.find(col => col.toLowerCase().includes('date')) || 'Date',
      price: columns.find(col => col.toLowerCase().includes('price')) || 'Price',
      open: columns.find(col => col.toLowerCase().includes('open')) || 'Open',
      high: columns.find(col => col.toLowerCase().includes('high')) || 'High',
      low: columns.find(col => col.toLowerCase().includes('low')) || 'Low',
      volume: columns.find(col => col.toLowerCase().includes('vol')) || 'Vol.',
      change: columns.find(col => col.toLowerCase().includes('change')) || 'Change%'
    };
  }, [data, isStockData]);

  // Prepare stock chart data with windowing for performance
  const { fullStockData, stockChartData, windowInfo } = useMemo(() => {
    if (!isStockData) return { fullStockData: [], stockChartData: [], windowInfo: { total: 0, start: 0, end: 0 } };

    // First, prepare all data and sort chronologically
    let processedData = data;

    const fullChartData = processedData.map((row) => {
      const parseValue = (val: any, isVolume = false) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          let cleaned = val.trim();

          // Handle volume-specific formats (K, M, B suffixes)
          if (isVolume) {
            const upperVal = cleaned.toUpperCase();
            let multiplier = 1;

            if (upperVal.includes('K')) {
              multiplier = 1000;
              cleaned = cleaned.replace(/[Kk]/g, '');
            } else if (upperVal.includes('M')) {
              multiplier = 1000000;
              cleaned = cleaned.replace(/[Mm]/g, '');
            } else if (upperVal.includes('B')) {
              multiplier = 1000000000;
              cleaned = cleaned.replace(/[Bb]/g, '');
            }

            // Remove % sign, all commas, and any other non-numeric characters except decimal points and minus signs
            cleaned = cleaned.replace(/%/g, '').replace(/,/g, '').replace(/[^\d.-]/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed * multiplier;
          }

          // Regular parsing for non-volume data
          cleaned = cleaned.replace(/%/g, '').replace(/,/g, '').replace(/[^\d.-]/g, '');
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      };

      return {
        date: row[stockColumns.date] ? String(row[stockColumns.date]).substring(0, 10) : '',
        price: parseValue(row[stockColumns.price]),
        open: parseValue(row[stockColumns.open]),
        high: parseValue(row[stockColumns.high]),
        low: parseValue(row[stockColumns.low]),
        volume: parseValue(row[stockColumns.volume], true),
        change: parseValue(row[stockColumns.change]),
        originalDate: row[stockColumns.date] // Keep original for sorting
      };
    });

    // Sort by date in chronological order (oldest to newest)
    const sortedData = fullChartData.sort((a, b) => {
      const dateStrA = String(a.originalDate || a.date);
      const dateStrB = String(b.originalDate || b.date);
      const dateA = new Date(dateStrA);
      const dateB = new Date(dateStrB);

      // Handle invalid dates
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

      return dateA.getTime() - dateB.getTime();
    });

    // Apply windowing for performance
    const totalRecords = sortedData.length;
    let actualWindowStart;

    // If windowStart is -1 (initial/auto state), show the last N records
    // Otherwise, use the specified windowStart
    if (windowStart === -1) {
      actualWindowStart = Math.max(0, totalRecords - windowSize);
    } else {
      actualWindowStart = windowStart;
    }

    // Ensure window doesn't exceed data bounds
    actualWindowStart = Math.max(0, Math.min(actualWindowStart, totalRecords - windowSize));
    const windowEnd = Math.min(actualWindowStart + windowSize, totalRecords);

    const windowedData = sortedData.slice(actualWindowStart, windowEnd);

    const result = {
      fullStockData: sortedData,
      stockChartData: windowedData,
      windowInfo: {
        total: totalRecords,
        start: actualWindowStart,
        end: windowEnd
      }
    };

    // Debug logging
    console.log('Window calculation:', {
      totalRecords,
      windowStart,
      windowSize,
      actualWindowStart,
      windowEnd,
      windowedDataLength: windowedData.length
    });

    return result;
  }, [data, isStockData, stockColumns, windowSize, windowStart]);

  // Calculate stock metrics using full dataset
  const stockMetrics = useMemo(() => {
    if (!isStockData || fullStockData.length === 0) return null;

    const prices = fullStockData.map(d => d.price).filter(p => p > 0);
    const volumes = fullStockData.map(d => d.volume).filter(v => v > 0);
    const changes = fullStockData.map(d => d.change);

    if (prices.length === 0) return null;

    const currentPrice = prices[0];
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);
    const avgVolume = volumes.length > 0 ? volumes.reduce((sum, v) => sum + v, 0) / volumes.length : 0;
    const totalReturn = changes.reduce((sum, c) => sum + c, 0);

    return {
      currentPrice,
      highestPrice,
      lowestPrice,
      avgVolume,
      totalReturn,
      priceRange: highestPrice - lowestPrice,
      volatility: Math.sqrt(changes.reduce((sum, c) => sum + Math.pow(c, 2), 0) / changes.length)
    };
  }, [fullStockData, isStockData]);

  // Chart navigation functions
  const safeWindowInfo = windowInfo || { start: 0, end: Math.min(10, data.length), total: data.length };
  const canScrollLeft = safeWindowInfo.start > 0;
  const canScrollRight = safeWindowInfo.end < safeWindowInfo.total;

  const scrollLeft = () => {
    const currentStart = windowStart === -1 ? Math.max(0, safeWindowInfo.total - windowSize) : windowStart;
    const newStart = Math.max(0, currentStart - Math.floor(windowSize / 2));
    setWindowStart(newStart);
  };

  const scrollRight = () => {
    const currentStart = windowStart === -1 ? Math.max(0, safeWindowInfo.total - windowSize) : windowStart;
    const maxStart = Math.max(0, safeWindowInfo.total - windowSize);
    const newStart = Math.min(maxStart, currentStart + Math.floor(windowSize / 2));
    setWindowStart(newStart);
  };

  const zoomIn = () => {
    const newSize = Math.max(5, Math.floor(windowSize * 0.7));
    const currentStart = windowStart === -1 ? Math.max(0, safeWindowInfo.total - windowSize) : windowStart;

    // Try to keep the center of the current window
    const currentCenter = currentStart + Math.floor(windowSize / 2);
    const newStart = Math.max(0, Math.min(safeWindowInfo.total - newSize, currentCenter - Math.floor(newSize / 2)));

    setWindowSize(newSize);
    setWindowStart(newStart);
  };

  const zoomOut = () => {
    const newSize = Math.min(safeWindowInfo.total, Math.floor(windowSize * 1.5));
    const currentStart = windowStart === -1 ? Math.max(0, safeWindowInfo.total - windowSize) : windowStart;

    // Try to keep the center of the current window
    const currentCenter = currentStart + Math.floor(windowSize / 2);
    const newStart = Math.max(0, Math.min(safeWindowInfo.total - newSize, currentCenter - Math.floor(newSize / 2)));

    setWindowSize(newSize);
    setWindowStart(newStart);
  };

  const resetView = () => {
    setWindowSize(10);
    setWindowStart(-1); // This will trigger showing last 10 records
  };

  const showAllRecords = () => {
    setWindowSize(safeWindowInfo.total);
    setWindowStart(0); // Show from beginning when showing all
  };

  // Create chart components with expand functionality
  const PriceChart = ({ height = 300, fullScreen = false }: { height?: number; fullScreen?: boolean }) => (
    <div
      style={{
        height: fullScreen ? '100%' : `${height}px`,
        width: '100%',
        minHeight: fullScreen ? '400px' : `${height}px`
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={stockChartData}
          margin={{
            top: fullScreen ? 30 : 20,
            right: fullScreen ? 40 : 30,
            left: fullScreen ? 30 : 20,
            bottom: fullScreen ? 140 : (height > 300 ? 100 : 80)
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: fullScreen ? 14 : (height > 300 ? 12 : 11), fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={fullScreen ? 120 : (height > 300 ? 80 : 60)}
            interval={fullScreen ? Math.max(0, Math.floor(stockChartData.length / 12)) : 'preserveStartEnd'}
          />
          <YAxis
            tick={{ fontSize: fullScreen ? 15 : (height > 300 ? 13 : 12), fill: axisColor }}
            stroke={axisColor}
            width={fullScreen ? 80 : 60}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: height > 300 ? '14px' : '12px',
              color: tooltipTextColor
            }}
            formatter={(value: any, name: string) => [`$${Number(value).toFixed(2)}`, name]}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke={STOCK_COLORS.price}
            strokeWidth={height > 300 ? 4 : 3}
            dot={{ r: height > 300 ? 4 : 3, fill: STOCK_COLORS.price }}
            activeDot={{ r: height > 300 ? 7 : 6, fill: STOCK_COLORS.price }}
            name="Close Price"
          />
          <Line
            type="monotone"
            dataKey="open"
            stroke={STOCK_COLORS.neutral}
            strokeWidth={height > 300 ? 2 : 1}
            strokeDasharray="8 4"
            dot={false}
            name="Open Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const VolumeChart = ({ height = 300, fullScreen = false }: { height?: number; fullScreen?: boolean }) => (
    <div
      style={{
        height: fullScreen ? '100%' : `${height}px`,
        width: '100%',
        minHeight: fullScreen ? '400px' : `${height}px`
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stockChartData}
          margin={{
            top: fullScreen ? 30 : 20,
            right: fullScreen ? 40 : 30,
            left: fullScreen ? 30 : 20,
            bottom: fullScreen ? 140 : (height > 300 ? 100 : 80)
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: fullScreen ? 14 : (height > 300 ? 12 : 11), fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={fullScreen ? 120 : (height > 300 ? 80 : 60)}
            interval={fullScreen ? Math.max(0, Math.floor(stockChartData.length / 12)) : 'preserveStartEnd'}
          />
          <YAxis
            tick={{ fontSize: fullScreen ? 15 : (height > 300 ? 13 : 12), fill: axisColor }}
            stroke={axisColor}
            width={fullScreen ? 80 : 60}
            domain={[0, 'dataMax']}
            tickFormatter={(value) => {
              if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toString();
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: height > 300 ? '14px' : '12px',
              color: tooltipTextColor
            }}
            formatter={(value: any) => [Number(value).toLocaleString(), 'Volume']}
          />
          <Bar
            dataKey="volume"
            fill={STOCK_COLORS.volume}
            radius={[4, 4, 0, 0]}
            stroke={STOCK_COLORS.volume}
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const OHLCChart = ({ height = 350, fullScreen = false }: { height?: number; fullScreen?: boolean }) => {
    return (
      <CandlestickChart 
        data={stockChartData}
        height={height}
        fullScreen={fullScreen}
        isDarkMode={isDarkMode}
      />
    );
  };

  const OHLCChartOld = ({ height = 350, fullScreen = false }: { height?: number; fullScreen?: boolean }) => (
    <div
      style={{
        height: fullScreen ? '100%' : `${height}px`,
        width: '100%',
        minHeight: fullScreen ? '400px' : `${height}px`
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={stockChartData}
          margin={{
            top: fullScreen ? 30 : 20,
            right: fullScreen ? 40 : 30,
            left: fullScreen ? 30 : 20,
            bottom: fullScreen ? 140 : (height > 350 ? 120 : 100)
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: fullScreen ? 14 : (height > 350 ? 12 : 10), fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={fullScreen ? 120 : (height > 350 ? 100 : 80)}
            interval={fullScreen ? Math.max(0, Math.floor(stockChartData.length / 10)) : 'preserveStartEnd'}
          />
          <YAxis
            tick={{ fontSize: fullScreen ? 15 : (height > 350 ? 13 : 11), fill: axisColor }}
            stroke={axisColor}
            width={fullScreen ? 80 : 60}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: height > 350 ? '14px' : '12px',
              color: tooltipTextColor
            }}
            formatter={(value: any, name: string) => [`$${Number(value).toFixed(2)}`, name]}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke={STOCK_COLORS.support}
            strokeWidth={height > 350 ? 3 : 2}
            dot={{ r: 2, fill: STOCK_COLORS.support }}
            name="High"
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke={STOCK_COLORS.resistance}
            strokeWidth={height > 350 ? 3 : 2}
            dot={{ r: 2, fill: STOCK_COLORS.resistance }}
            name="Low"
          />
          <Line
            type="monotone"
            dataKey="open"
            stroke={STOCK_COLORS.neutral}
            strokeWidth={height > 350 ? 3 : 2}
            dot={{ r: height > 350 ? 4 : 3, fill: STOCK_COLORS.neutral }}
            name="Open"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={STOCK_COLORS.price}
            strokeWidth={height > 350 ? 4 : 3}
            dot={{ r: height > 350 ? 5 : 4, fill: STOCK_COLORS.price }}
            name="Close"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const ReturnsChart = ({ height = 350, fullScreen = false }: { height?: number; fullScreen?: boolean }) => (
    <div
      style={{
        height: fullScreen ? '100%' : `${height}px`,
        width: '100%',
        minHeight: fullScreen ? '400px' : `${height}px`
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stockChartData}
          margin={{
            top: fullScreen ? 30 : 20,
            right: fullScreen ? 40 : 30,
            left: fullScreen ? 30 : 20,
            bottom: fullScreen ? 140 : (height > 350 ? 120 : 100)
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: fullScreen ? 14 : (height > 350 ? 12 : 10), fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={fullScreen ? 120 : (height > 350 ? 100 : 80)}
            interval={fullScreen ? Math.max(0, Math.floor(stockChartData.length / 10)) : 'preserveStartEnd'}
          />
          <YAxis
            tick={{ fontSize: fullScreen ? 15 : (height > 350 ? 13 : 11), fill: axisColor }}
            width={fullScreen ? 80 : 60}
            stroke={axisColor}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: fullScreen ? '16px' : (height > 350 ? '14px' : '12px'),
              color: tooltipTextColor,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any) => [
              `${Number(value).toFixed(2)}%`,
              Number(value) >= 0 ? 'Gain' : 'Loss'
            ]}
          />
          <Bar
            dataKey="change"
            radius={[2, 2, 0, 0]}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          >
            {stockChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.change >= 0 ? STOCK_COLORS.bullish : STOCK_COLORS.bearish}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (isLoading) {
    return <ChartSkeleton count={showAll ? 4 : 2} />;
  }

  if (!isStockData || stockChartData.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-base font-light">Stock Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8 font-light">
            No stock data found. Expected columns: Date, Price, Open, High, Low, Vol., Change%
          </p>
        </CardContent>
      </Card>
    );
  }

  // Chart Controls Component
  const ChartControls = () => {
    const safeWindowInfo = windowInfo || { start: 0, end: Math.min(10, data.length), total: data.length };

    return (
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Showing {safeWindowInfo.start + 1}-{safeWindowInfo.end} of {safeWindowInfo.total} records</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Navigation Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0"
            title="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0"
            title="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Zoom Controls */}
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={windowSize <= 5}
            className="h-8 w-8 p-0"
            title="Zoom in (show fewer records)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={windowSize >= safeWindowInfo.total}
            className="h-8 w-8 p-0"
            title="Zoom out (show more records)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          {/* Reset and Show All */}
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="h-8 px-2 text-xs"
            title="Reset to last 10 records"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>

          {safeWindowInfo.total > 10 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={showAllRecords}
              className="h-8 px-2 text-xs"
              title="Show all records"
            >
              Show All
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Compact Chart Controls for Full-Screen Mode
  const CompactChartControls = () => {
    const safeWindowInfo = windowInfo || { start: 0, end: Math.min(10, data.length), total: data.length };

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Showing {safeWindowInfo.start + 1}-{safeWindowInfo.end} of {safeWindowInfo.total} records</span>
          {safeWindowInfo.total > windowSize && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
              Windowed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Navigation Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-7 w-7 p-0"
            title="Scroll left"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-7 w-7 p-0"
            title="Scroll right"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>

          {/* Zoom Controls */}
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={windowSize <= 5}
            className="h-7 w-7 p-0"
            title="Zoom in"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={windowSize >= safeWindowInfo.total}
            className="h-7 w-7 p-0"
            title="Zoom out"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>

          {/* Reset */}
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="h-7 px-2 text-xs"
            title="Reset to last 10 records"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    );
  };

  if (!showAll) {
    // Overview mode - show 2 most relevant stock charts
    return (
      <>
        {isStockData && data.length > 0 && <ChartControls />}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Price Trend Chart */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <CardTitle className="text-base font-light">Price Movement</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullScreenChart('price')}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="View in full screen"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
              <CardDescription className="font-light">
                Stock price trend over {stockChartData.length} trading days
                {windowInfo.total > stockChartData.length && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    (Showing {windowInfo.start + 1}-{windowInfo.end} of {windowInfo.total} total records)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceChart />
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <CardTitle className="text-base font-light">Trading Volume</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullScreenChart('volume')}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="View in full screen"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
              <CardDescription className="font-light">
                Daily trading volume analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VolumeChart />
            </CardContent>
          </Card>
        </div>

        {/* Full Screen Modals */}
        <FullScreenChart
          isOpen={fullScreenChart === 'price'}
          onClose={() => setFullScreenChart(null)}
          title="Price Movement Analysis"
          description={`Detailed stock price trend over ${stockChartData.length} trading days${data.length > stockChartData.length ? ` (sampled from ${data.length} total records)` : ''}`}
          icon={<TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
          controls={<CompactChartControls />}
        >
          <PriceChart fullScreen={true} />
        </FullScreenChart>

        <FullScreenChart
          isOpen={fullScreenChart === 'volume'}
          onClose={() => setFullScreenChart(null)}
          title="Trading Volume Analysis"
          description={`Detailed daily trading volume patterns and trends${data.length > stockChartData.length ? ` (${stockChartData.length} of ${data.length} records shown)` : ''}`}
          icon={<BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
          controls={<CompactChartControls />}
        >
          <VolumeChart fullScreen={true} />
        </FullScreenChart>
      </>
    );
  }

  // Full stock charts view - show comprehensive stock analysis
  return (
    <>
      {isStockData && data.length > 0 && <ChartControls />}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Candlestick Chart */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base font-light">Candlestick Chart</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullScreenChart('ohlc')}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="View in full screen"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="font-light">
              Professional OHLC candlestick analysis with bullish/bearish indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OHLCChart />
          </CardContent>
        </Card>

        {/* Volume Analysis */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base font-light">Volume Analysis</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullScreenChart('volume-full')}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="View in full screen"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="font-light">
              Trading volume with price correlation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VolumeChart />
          </CardContent>
        </Card>

        {/* Price Change Analysis */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base font-light">Daily Returns</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullScreenChart('returns')}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="View in full screen"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="font-light">
              Daily percentage changes in stock price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReturnsChart />
          </CardContent>
        </Card>

        {/* Stock Metrics Summary */}
        {stockMetrics && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <CardTitle className="text-base font-light">Key Metrics</CardTitle>
              </div>
              <CardDescription className="font-light">
                Statistical summary of stock performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">Current Price</span>
                    <p className="font-bold text-lg text-blue-700 dark:text-blue-300">
                      ${stockMetrics.currentPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <span className="text-green-600 dark:text-green-400 text-xs font-medium">52W High</span>
                    <p className="font-bold text-lg text-green-700 dark:text-green-300">
                      ${stockMetrics.highestPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <span className="text-red-600 dark:text-red-400 text-xs font-medium">52W Low</span>
                    <p className="font-bold text-lg text-red-700 dark:text-red-300">
                      ${stockMetrics.lowestPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                    <span className="text-cyan-600 dark:text-cyan-400 text-xs font-medium">Avg Volume</span>
                    <p className="font-bold text-lg text-cyan-700 dark:text-cyan-300">
                      {(stockMetrics.avgVolume / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border ${stockMetrics.totalReturn >= 0
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                    <span className={`text-xs font-medium ${stockMetrics.totalReturn >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      Total Return
                    </span>
                    <p className={`font-bold text-lg ${stockMetrics.totalReturn >= 0
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                      }`}>
                      {stockMetrics.totalReturn >= 0 ? '+' : ''}{stockMetrics.totalReturn.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <span className="text-purple-600 dark:text-purple-400 text-xs font-medium">Volatility</span>
                    <p className="font-bold text-lg text-purple-700 dark:text-purple-300">
                      {stockMetrics.volatility.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full Screen Modals for All Charts */}
      <FullScreenChart
        isOpen={fullScreenChart === 'ohlc'}
        onClose={() => setFullScreenChart(null)}
        title="Candlestick Chart Analysis"
        description="Professional OHLC candlestick chart with bullish/bearish indicators"
        icon={<BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
        controls={<CompactChartControls />}
      >
        <OHLCChart fullScreen={true} />
      </FullScreenChart>

      <FullScreenChart
        isOpen={fullScreenChart === 'volume-full'}
        onClose={() => setFullScreenChart(null)}
        title="Volume Analysis"
        description={`Detailed trading volume patterns and market activity${data.length > stockChartData.length ? ` (${stockChartData.length} of ${data.length} records shown)` : ''}`}
        icon={<BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
        controls={<CompactChartControls />}
      >
        <VolumeChart height={600} />
      </FullScreenChart>

      <FullScreenChart
        isOpen={fullScreenChart === 'returns'}
        onClose={() => setFullScreenChart(null)}
        title="Daily Returns Analysis"
        description="Comprehensive daily percentage changes and volatility patterns"
        icon={<Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
        controls={<CompactChartControls />}
      >
        <ReturnsChart height={600} />
      </FullScreenChart>
    </>
  );
};

export default ChartSection;