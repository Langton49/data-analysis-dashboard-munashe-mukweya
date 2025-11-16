import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface CandlestickChartProps {
    data: any[];
    height?: number;
    fullScreen?: boolean;
    isDarkMode?: boolean;
}

export const CandlestickChart = ({ data, height = 350, fullScreen = false, isDarkMode = false }: CandlestickChartProps) => {
    const chartHeight = fullScreen ? '100%' : height;

    // Transform data to ApexCharts candlestick format
    const series = useMemo(() => {
        const candlestickData = data.map(item => ({
            x: new Date(item.date).getTime(),
            y: [item.open, item.high, item.low, item.price] // [open, high, low, close]
        }));

        return [{
            name: 'Stock Price',
            data: candlestickData
        }];
    }, [data]);

    // Chart options
    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: 'candlestick',
            height: chartHeight,
            background: 'transparent',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            }
        },
        title: {
            text: 'OHLC Candlestick Analysis',
            align: 'left',
            style: {
                fontSize: fullScreen ? '18px' : '16px',
                fontWeight: '300',
                color: isDarkMode ? '#f3f4f6' : '#111827'
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: isDarkMode ? '#9ca3af' : '#6b7280',
                    fontSize: fullScreen ? '13px' : '11px'
                },
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH:mm'
                }
            },
            axisBorder: {
                color: isDarkMode ? '#374151' : '#e5e7eb'
            },
            axisTicks: {
                color: isDarkMode ? '#374151' : '#e5e7eb'
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                style: {
                    colors: isDarkMode ? '#9ca3af' : '#6b7280',
                    fontSize: fullScreen ? '13px' : '11px'
                },
                formatter: (value) => `$${value.toFixed(2)}`
            }
        },
        grid: {
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            strokeDashArray: 3
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#16a34a',   // Green for bullish
                    downward: '#dc2626'  // Red for bearish
                },
                wick: {
                    useFillColor: true
                }
            }
        },
        tooltip: {
            enabled: true,
            theme: isDarkMode ? 'dark' : 'light',
            style: {
                fontSize: fullScreen ? '14px' : '12px'
            },
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                const date = new Date(data.x).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                const [open, high, low, close] = data.y;
                const change = close - open;
                const changePercent = ((change / open) * 100).toFixed(2);
                const isBullish = close >= open;

                return `
          <div style="
            padding: 12px;
            background: ${isDarkMode ? '#1f2937' : '#ffffff'};
            border: 2px solid ${isBullish ? '#16a34a' : '#dc2626'};
            border-radius: 8px;
            min-width: 200px;
          ">
            <div style="
              font-weight: bold;
              margin-bottom: 10px;
              font-size: ${fullScreen ? '15px' : '13px'};
              color: ${isDarkMode ? '#f3f4f6' : '#111827'};
            ">${date}</div>
            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 10px;
            ">
              <div>
                <div style="color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; font-size: 11px; margin-bottom: 2px;">Open</div>
                <div style="font-weight: bold; color: ${isDarkMode ? '#f3f4f6' : '#111827'};">$${open.toFixed(2)}</div>
              </div>
              <div>
                <div style="color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; font-size: 11px; margin-bottom: 2px;">Close</div>
                <div style="font-weight: bold; color: ${isBullish ? '#16a34a' : '#dc2626'};">$${close.toFixed(2)}</div>
              </div>
              <div>
                <div style="color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; font-size: 11px; margin-bottom: 2px;">High</div>
                <div style="font-weight: bold; color: #16a34a;">$${high.toFixed(2)}</div>
              </div>
              <div>
                <div style="color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; font-size: 11px; margin-bottom: 2px;">Low</div>
                <div style="font-weight: bold; color: #dc2626;">$${low.toFixed(2)}</div>
              </div>
            </div>
            <div style="
              padding-top: 10px;
              border-top: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
              text-align: center;
            ">
              <div style="color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; font-size: 11px; margin-bottom: 4px;">Daily Change</div>
              <div style="
                font-weight: bold;
                font-size: ${fullScreen ? '15px' : '13px'};
                color: ${isBullish ? '#16a34a' : '#dc2626'};
              ">
                ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)
              </div>
            </div>
          </div>
        `;
            }
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontSize: fullScreen ? '14px' : '12px',
            labels: {
                colors: isDarkMode ? '#9ca3af' : '#6b7280'
            },
            markers: {
                size: fullScreen ? 6 : 5
            }
        },
        theme: {
            mode: isDarkMode ? 'dark' : 'light'
        }
    }), [chartHeight, fullScreen, isDarkMode]);

    return (
        <div
            style={{
                width: '100%',
                height: fullScreen ? '100%' : `${height}px`,
                minHeight: fullScreen ? '500px' : `${height}px`,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <ReactApexChart
                options={options}
                series={series}
                type="candlestick"
                height={chartHeight}
            />
        </div>
    );
};

export default CandlestickChart;
