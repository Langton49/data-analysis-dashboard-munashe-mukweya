
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ScatterChart, Scatter } from 'recharts';
import { DataRow } from '@/types/data';
import { getDataSummary, getColumnValues } from '@/utils/dataAnalysis';
import { ChartSkeleton } from './skeletons';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ChartSectionProps {
  data: DataRow[];
  showAll?: boolean;
}

// Color palettes for light and dark modes
const COLORS_LIGHT = ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'];
const COLORS_DARK = ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151'];

const ChartSection = ({ data, showAll = false }: ChartSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  
  const numericColumns = useMemo(() => {
    return Object.entries(summary.columnTypes)
      .filter(([_, type]) => type === 'numeric')
      .map(([column]) => column);
  }, [summary]);

  const textColumns = useMemo(() => {
    return Object.entries(summary.columnTypes)
      .filter(([_, type]) => type === 'text')
      .map(([column]) => column);
  }, [summary]);

  // Get a meaningful label column (first text column or index)
  const labelColumn = textColumns[0] || null;

  // Prepare data for bar/line charts with better labels
  const chartData = useMemo(() => {
    if (numericColumns.length === 0) return [];
    
    const sampleSize = showAll ? 30 : 15;
    return data.slice(0, sampleSize).map((row, index) => {
      const item: any = { 
        name: labelColumn && row[labelColumn] 
          ? String(row[labelColumn]).substring(0, 20) 
          : `#${index + 1}` 
      };
      numericColumns.forEach(col => {
        item[col] = typeof row[col] === 'number' ? row[col] : 0;
      });
      return item;
    });
  }, [data, numericColumns, labelColumn, showAll]);

  // Prepare aggregated data for pie chart (top categories)
  const pieData = useMemo(() => {
    if (numericColumns.length === 0) return [];
    
    const column = numericColumns[0];
    const allValues = getColumnValues(data, column);
    const values = allValues.filter((v): v is number => typeof v === 'number');
    
    // Calculate sum and create percentage distribution
    const total: number = values.reduce((sum, val) => sum + val, 0);
    
    return values
      .slice(0, 6)
      .map((value, index) => {
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
        return {
          name: labelColumn && data[index]?.[labelColumn] 
            ? String(data[index][labelColumn]).substring(0, 15)
            : `Item ${index + 1}`,
          value,
          percentage
        };
      })
      .filter(item => item.value > 0);
  }, [data, numericColumns, labelColumn]);

  // Prepare scatter plot data (if we have 2+ numeric columns)
  const scatterData = useMemo(() => {
    if (numericColumns.length < 2) return [];
    
    return data.slice(0, 50).map((row) => {
      const xVal = row[numericColumns[0]];
      const yVal = row[numericColumns[1]];
      return {
        x: typeof xVal === 'number' ? xVal : 0,
        y: typeof yVal === 'number' ? yVal : 0,
      };
    }).filter(point => point.x !== 0 || point.y !== 0);
  }, [data, numericColumns]);

  if (isLoading) {
    return <ChartSkeleton count={showAll ? 4 : 2} />;
  }

  if (numericColumns.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-base font-light">Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8 font-light">
            No numeric columns found for visualization.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!showAll) {
    // Overview mode - show 2 most relevant charts
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <CardTitle className="text-base font-light">Value Comparison</CardTitle>
            </div>
            <CardDescription className="font-light">
              Comparing {numericColumns.slice(0, 2).join(' and ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: axisColor }}
                    stroke={axisColor}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: axisColor }}
                    stroke={axisColor}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: tooltipTextColor
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {numericColumns.slice(0, 2).map((column, idx) => (
                    <Bar 
                      key={column} 
                      dataKey={column} 
                      fill={COLORS[idx % COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <CardTitle className="text-base font-light">Trend Analysis</CardTitle>
            </div>
            <CardDescription className="font-light">
              Tracking changes over {chartData.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: axisColor }}
                    stroke={axisColor}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: axisColor }}
                    stroke={axisColor}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: tooltipTextColor
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {numericColumns.slice(0, 2).map((column, idx) => (
                    <Line 
                      key={column}
                      type="monotone" 
                      dataKey={column} 
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Full charts view - show all chart types
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <CardTitle className="text-base font-light">Value Comparison</CardTitle>
          </div>
          <CardDescription className="font-light">
            Comparing values across {numericColumns.length} numeric column{numericColumns.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: axisColor }}
                  stroke={axisColor}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: axisColor }}
                  stroke={axisColor}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: tooltipTextColor
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {numericColumns.slice(0, 4).map((column, idx) => (
                  <Bar 
                    key={column} 
                    dataKey={column} 
                    fill={COLORS[idx % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <CardTitle className="text-base font-light">Trend Analysis</CardTitle>
          </div>
          <CardDescription className="font-light">
            Tracking changes and patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: axisColor }}
                  stroke={axisColor}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: axisColor }}
                  stroke={axisColor}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: tooltipTextColor
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {numericColumns.slice(0, 4).map((column, idx) => (
                  <Line 
                    key={column}
                    type="monotone" 
                    dataKey={column} 
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <CardTitle className="text-base font-light">Distribution</CardTitle>
          </div>
          <CardDescription className="font-light">
            Proportional breakdown of {numericColumns[0]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, 'Value']}
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: tooltipTextColor
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scatter Plot (if 2+ numeric columns) */}
      {numericColumns.length >= 2 && scatterData.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <CardTitle className="text-base font-light">Correlation</CardTitle>
            </div>
            <CardDescription className="font-light">
              Relationship between {numericColumns[0]} and {numericColumns[1]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={numericColumns[0]}
                    tick={{ fontSize: 11, fill: axisColor }}
                    stroke={axisColor}
                    label={{ value: numericColumns[0], position: 'insideBottom', offset: -5, fontSize: 11, fill: axisColor }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={numericColumns[1]}
                    tick={{ fontSize: 11, fill: axisColor }}
                    stroke={axisColor}
                    label={{ value: numericColumns[1], angle: -90, position: 'insideLeft', fontSize: 11, fill: axisColor }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: tooltipTextColor
                    }}
                  />
                  <Scatter 
                    data={scatterData} 
                    fill={COLORS[0]}
                    opacity={0.6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartSection;
