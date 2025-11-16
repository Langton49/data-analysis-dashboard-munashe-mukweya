import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';

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

interface ChartProps {
  data: any[];
  height?: number;
  fullScreen?: boolean;
  isDarkMode?: boolean;
}

// Enhanced chart components with better full-screen support
export const EnhancedPriceChart = ({ data, height = 300, fullScreen = false, isDarkMode = false }: ChartProps) => {
  const chartHeight = fullScreen ? '100%' : `${height}px`;
  const fontSize = fullScreen ? 14 : (height > 300 ? 12 : 11);
  const axisHeight = fullScreen ? 100 : (height > 300 ? 80 : 60);
  
  // Dynamic styles for dark mode
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const axisColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';
  
  return (
    <div 
      style={{ 
        height: chartHeight,
        width: '100%',
        minHeight: fullScreen ? '300px' : `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ 
            top: fullScreen ? 30 : 20, 
            right: fullScreen ? 40 : 30, 
            left: fullScreen ? 30 : 20, 
            bottom: axisHeight 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize, fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={axisHeight}
            interval={fullScreen ? Math.max(0, Math.floor(data.length / 10)) : 'preserveStartEnd'}
          />
          <YAxis 
            tick={{ fontSize: fontSize + 1, fill: axisColor }}
            stroke={axisColor}
            domain={['dataMin - 5', 'dataMax + 5']}
            width={fullScreen ? 80 : 60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: `${fontSize}px`,
              color: tooltipTextColor,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, name: string) => [`$${Number(value).toFixed(2)}`, name]}
          />
          <Legend 
            wrapperStyle={{ fontSize: `${fontSize}px`, paddingTop: '10px' }}
            iconSize={fullScreen ? 12 : 8}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={STOCK_COLORS.price}
            strokeWidth={fullScreen ? 4 : (height > 300 ? 3 : 2)}
            dot={{ r: fullScreen ? 5 : (height > 300 ? 4 : 3), fill: STOCK_COLORS.price }}
            activeDot={{ r: fullScreen ? 8 : (height > 300 ? 7 : 6), fill: STOCK_COLORS.price }}
            name="Close Price"
          />
          <Line 
            type="monotone" 
            dataKey="open" 
            stroke={STOCK_COLORS.neutral}
            strokeWidth={fullScreen ? 3 : (height > 300 ? 2 : 1)}
            strokeDasharray="8 4"
            dot={false}
            name="Open Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EnhancedVolumeChart = ({ data, height = 300, fullScreen = false, isDarkMode = false }: ChartProps) => {
  const chartHeight = fullScreen ? '100%' : `${height}px`;
  const fontSize = fullScreen ? 14 : (height > 300 ? 12 : 11);
  const axisHeight = fullScreen ? 100 : (height > 300 ? 80 : 60);
  
  // Dynamic styles for dark mode
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const axisColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';
  
  return (
    <div 
      style={{ 
        height: chartHeight,
        width: '100%',
        minHeight: fullScreen ? '300px' : `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ 
            top: fullScreen ? 30 : 20, 
            right: fullScreen ? 40 : 30, 
            left: fullScreen ? 30 : 20, 
            bottom: axisHeight 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize, fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={axisHeight}
            interval={fullScreen ? Math.max(0, Math.floor(data.length / 10)) : 'preserveStartEnd'}
          />
          <YAxis 
            tick={{ fontSize: fontSize + 1, fill: axisColor }}
            stroke={axisColor}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            width={fullScreen ? 80 : 60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: `${fontSize}px`,
              color: tooltipTextColor,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
};

export const EnhancedOHLCChart = ({ data, height = 350, fullScreen = false, isDarkMode = false }: ChartProps) => {
  const chartHeight = fullScreen ? '100%' : `${height}px`;
  const fontSize = fullScreen ? 14 : (height > 350 ? 12 : 10);
  const axisHeight = fullScreen ? 120 : (height > 350 ? 100 : 80);
  
  // Dynamic styles for dark mode
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const axisColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';
  
  return (
    <div 
      style={{ 
        height: chartHeight,
        width: '100%',
        minHeight: fullScreen ? '300px' : `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ 
            top: fullScreen ? 30 : 20, 
            right: fullScreen ? 40 : 30, 
            left: fullScreen ? 30 : 20, 
            bottom: axisHeight 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize, fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={axisHeight}
            interval={fullScreen ? Math.max(0, Math.floor(data.length / 8)) : 'preserveStartEnd'}
          />
          <YAxis 
            tick={{ fontSize: fontSize + 1, fill: axisColor }}
            stroke={axisColor}
            domain={['dataMin - 2', 'dataMax + 2']}
            width={fullScreen ? 80 : 60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: `${fontSize}px`,
              color: tooltipTextColor,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, name: string) => [`$${Number(value).toFixed(2)}`, name]}
          />
          <Legend 
            wrapperStyle={{ fontSize: `${fontSize}px`, paddingTop: '10px' }}
            iconSize={fullScreen ? 12 : 8}
          />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke={STOCK_COLORS.support} 
            strokeWidth={fullScreen ? 3 : 2} 
            dot={{ r: fullScreen ? 3 : 2, fill: STOCK_COLORS.support }} 
            name="High" 
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke={STOCK_COLORS.resistance} 
            strokeWidth={fullScreen ? 3 : 2} 
            dot={{ r: fullScreen ? 3 : 2, fill: STOCK_COLORS.resistance }} 
            name="Low" 
          />
          <Line 
            type="monotone" 
            dataKey="open" 
            stroke={STOCK_COLORS.neutral} 
            strokeWidth={fullScreen ? 3 : 2} 
            dot={{ r: fullScreen ? 4 : 3, fill: STOCK_COLORS.neutral }} 
            name="Open" 
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={STOCK_COLORS.price} 
            strokeWidth={fullScreen ? 4 : 3} 
            dot={{ r: fullScreen ? 5 : 4, fill: STOCK_COLORS.price }} 
            name="Close" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EnhancedReturnsChart = ({ data, height = 350, fullScreen = false, isDarkMode = false }: ChartProps) => {
  const chartHeight = fullScreen ? '100%' : `${height}px`;
  const fontSize = fullScreen ? 14 : (height > 350 ? 12 : 10);
  const axisHeight = fullScreen ? 120 : (height > 350 ? 100 : 80);
  
  // Dynamic styles for dark mode
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const axisColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';
  
  return (
    <div 
      style={{ 
        height: chartHeight,
        width: '100%',
        minHeight: fullScreen ? '300px' : `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ 
            top: fullScreen ? 30 : 20, 
            right: fullScreen ? 40 : 30, 
            left: fullScreen ? 30 : 20, 
            bottom: axisHeight 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize, fill: axisColor }}
            stroke={axisColor}
            angle={-45}
            textAnchor="end"
            height={axisHeight}
            interval={fullScreen ? Math.max(0, Math.floor(data.length / 8)) : 'preserveStartEnd'}
          />
          <YAxis 
            tick={{ fontSize: fontSize + 1, fill: axisColor }}
            stroke={axisColor}
            tickFormatter={(value) => `${value}%`}
            width={fullScreen ? 80 : 60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '6px',
              fontSize: `${fontSize}px`,
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
            {data.map((entry, index) => (
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
};