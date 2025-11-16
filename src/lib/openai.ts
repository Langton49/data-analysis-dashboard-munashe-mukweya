// OpenAI API integration for chat functionality

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DataContext {
  summary: {
    totalRows: number;
    totalColumns: number;
    numericColumns: number;
    textColumns: number;
    columnTypes: Record<string, string>;
  };
  insights: Array<{
    title: string;
    description: string;
    type: string;
  }>;
  numericColumns: string[];
  sampleData?: string; // CSV string of sample data
}

/**
 * Convert data rows to CSV string format
 */
function dataToCSV(data: any[], maxRows: number = 100): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.slice(0, maxRows);
  
  const csvLines = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return '';
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      }).join(',')
    )
  ];
  
  return csvLines.join('\n');
}

/**
 * Generate a system prompt with data context and sample data
 */
export function generateSystemPrompt(dataContext: DataContext): string {
  // Check if this is stock data
  const stockColumns = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change%'];
  const isStockData = dataContext.numericColumns.some(col => 
    stockColumns.some(stockCol => col.toLowerCase().includes(stockCol.toLowerCase()))
  );

  const basePrompt = isStockData 
    ? `You are a professional stock market analyst and financial advisor. You specialize in analyzing historical stock data and providing investment insights.

Current Stock Dataset Context:
- Trading Days: ${dataContext.summary.totalRows.toLocaleString()}
- Data Columns: ${dataContext.summary.totalColumns}
- Key Metrics: ${dataContext.numericColumns.join(', ')}

Stock Analysis Insights:
${dataContext.insights.slice(0, 3).map(insight => `- ${insight.title}: ${insight.description}`).join('\n')}

Available Data Points:
${Object.entries(dataContext.summary.columnTypes).map(([col, type]) => `- ${col}: ${type}`).join('\n')}`
    : `You are a helpful data analysis assistant. You help users understand their dataset and answer questions about their data.

Current Dataset Context:
- Total Rows: ${dataContext.summary.totalRows.toLocaleString()}
- Total Columns: ${dataContext.summary.totalColumns}
- Numeric Columns: ${dataContext.summary.numericColumns} (${dataContext.numericColumns.join(', ')})
- Text Columns: ${dataContext.summary.textColumns}

Key Insights:
${dataContext.insights.slice(0, 3).map(insight => `- ${insight.title}: ${insight.description}`).join('\n')}

Column Types:
${Object.entries(dataContext.summary.columnTypes).map(([col, type]) => `- ${col}: ${type}`).join('\n')}`;

  // Add sample data if available
  if (dataContext.sampleData) {
    const guidelines = isStockData 
      ? `Stock Analysis Guidelines:
1. Focus on price movements, trends, and trading patterns
2. Analyze volatility, support/resistance levels, and momentum
3. Provide investment insights based on technical analysis
4. Explain market concepts in accessible terms
5. Consider risk factors and market conditions
6. Suggest relevant financial metrics and ratios
7. Reference specific dates and price points from the data
8. Keep advice educational and informative`
      : `Guidelines:
1. Use the actual data above to answer specific questions about values, names, dates, etc.
2. When asked about specific records, search through the sample data provided
3. Provide clear, concise answers with specific examples from the data
4. If the answer requires data beyond the sample, mention that you're analyzing the first 100 rows
5. Suggest visualizations when appropriate
6. Explain statistical concepts in simple terms
7. Be helpful and encouraging
8. Keep responses focused and actionable`;

    return `${basePrompt}

Sample Data (first ${Math.min(100, dataContext.summary.totalRows)} rows in CSV format):
\`\`\`csv
${dataContext.sampleData}
\`\`\`

${guidelines}`;
  }

  const guidelines = isStockData 
    ? `Stock Analysis Guidelines:
1. Provide technical analysis insights based on the data patterns
2. Explain stock market concepts and trading strategies
3. Analyze price trends, volatility, and volume patterns
4. Suggest relevant financial visualizations (candlestick charts, volume analysis)
5. Consider risk management and investment principles
6. Keep advice educational and informative
7. Focus on data-driven insights`
    : `Guidelines:
1. Provide clear, concise answers about the data
2. Use the dataset context to give specific insights
3. Suggest visualizations when appropriate
4. Explain statistical concepts in simple terms
5. Be helpful and encouraging
6. Keep responses focused and actionable`;

  return `${basePrompt}

${guidelines}`;
}

export { dataToCSV };

/**
 * Call OpenAI API for chat completion
 */
export async function getChatCompletion(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

/**
 * Stream chat completion (for real-time responses)
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
  apiKey: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming Error:', error);
    throw error;
  }
}

/**
 * Generate AI insights about the dataset
 */
export async function generateAIInsights(
  dataContext: DataContext,
  apiKey: string
): Promise<{ summary: string; anomalies: string[] }> {
  // Check if this is stock data
  const stockColumns = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change%'];
  const isStockData = dataContext.numericColumns.some(col => 
    stockColumns.some(stockCol => col.toLowerCase().includes(stockCol.toLowerCase()))
  );

  const prompt = isStockData 
    ? `Analyze this stock market dataset and provide:
1. A brief investment summary (2-3 sentences) highlighting key performance metrics
2. A list of 3-5 specific trading insights, market patterns, or risk factors

Stock Dataset Context:
- ${dataContext.summary.totalRows.toLocaleString()} trading days analyzed
- Available metrics: ${dataContext.numericColumns.join(', ')}
- Data columns: ${Object.entries(dataContext.summary.columnTypes).map(([col, type]) => `${col} (${type})`).join(', ')}

Current Stock Insights:
${dataContext.insights.slice(0, 5).map(insight => `- ${insight.title}: ${insight.description}`).join('\n')}

Focus on: price trends, volatility analysis, volume patterns, support/resistance levels, and risk assessment.

Respond in JSON format:
{
  "summary": "Investment-focused overview of stock performance",
  "anomalies": ["Trading insight 1", "Market pattern 2", "Risk factor 3", ...]
}`
    : `Analyze this dataset and provide:
1. A brief summary (2-3 sentences) of the most important findings
2. A list of 3-5 specific anomalies, patterns, or notable observations

Dataset Context:
- ${dataContext.summary.totalRows.toLocaleString()} rows, ${dataContext.summary.totalColumns} columns
- Numeric columns: ${dataContext.numericColumns.join(', ')}
- Column types: ${Object.entries(dataContext.summary.columnTypes).map(([col, type]) => `${col} (${type})`).join(', ')}

Current Insights:
${dataContext.insights.slice(0, 5).map(insight => `- ${insight.title}: ${insight.description}`).join('\n')}

Respond in JSON format:
{
  "summary": "Brief overview of key findings",
  "anomalies": ["Specific observation 1", "Specific observation 2", ...]
}`;

  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a data analysis expert. Provide concise, actionable insights in JSON format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await getChatCompletion(messages, apiKey);
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        summary: parsed.summary || 'No summary available',
        anomalies: Array.isArray(parsed.anomalies) ? parsed.anomalies : []
      };
    } catch {
      // If not valid JSON, create structured response from text
      return {
        summary: response.split('\n')[0] || 'Analysis complete',
        anomalies: response.split('\n').slice(1).filter(line => line.trim()).slice(0, 5)
      };
    }
  } catch (error) {
    console.error('AI Insights Error:', error);
    // Return fallback insights
    return getMockInsights(dataContext);
  }
}

/**
 * Fallback mock insights (if API fails)
 */
export function getMockInsights(dataContext: DataContext): { summary: string; anomalies: string[] } {
  // Check if this is stock data
  const stockColumns = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change%'];
  const isStockData = dataContext.numericColumns.some(col => 
    stockColumns.some(stockCol => col.toLowerCase().includes(stockCol.toLowerCase()))
  );

  if (isStockData) {
    return {
      summary: `Stock analysis covers ${dataContext.summary.totalRows.toLocaleString()} trading days with comprehensive OHLC data. Key metrics include price movements, volume analysis, and volatility patterns for investment decision-making.`,
      anomalies: [
        'Price volatility analysis reveals market sentiment and risk levels',
        'Volume spikes often correlate with significant price movements',
        'Support and resistance levels identified from price range analysis',
        'Daily returns show momentum patterns and trend directions',
        'Consider technical indicators for enhanced trading strategies'
      ]
    };
  }

  return {
    summary: `Dataset contains ${dataContext.summary.totalRows.toLocaleString()} records across ${dataContext.summary.totalColumns} columns. ${dataContext.summary.numericColumns} numeric columns available for statistical analysis.`,
    anomalies: [
      `${dataContext.numericColumns.length > 0 ? `${dataContext.numericColumns[0]} shows interesting variation` : 'Multiple data patterns detected'}`,
      `Data quality is ${Object.values(dataContext.summary.columnTypes).length === dataContext.summary.totalColumns ? 'good' : 'mixed'} across all columns`,
      `${dataContext.insights.length} automated insights were generated`,
      dataContext.summary.numericColumns >= 2 ? 'Correlation analysis recommended between numeric columns' : 'Consider adding more numeric columns for deeper analysis',
      'Review the Charts tab for visual patterns'
    ]
  };
}

/**
 * Fallback mock response (if API fails)
 */
export function getMockResponse(userMessage: string, dataContext: DataContext): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check if this is stock data
  const stockColumns = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change%'];
  const isStockData = dataContext.numericColumns.some(col => 
    stockColumns.some(stockCol => col.toLowerCase().includes(stockCol.toLowerCase()))
  );

  if (isStockData) {
    if (lowerMessage.includes('summary') || lowerMessage.includes('overview') || lowerMessage.includes('performance')) {
      return `Based on your stock data analysis, here's the investment overview:

📈 **Stock Performance Summary:**
- ${dataContext.summary.totalRows.toLocaleString()} trading days analyzed
- Key metrics: ${dataContext.numericColumns.slice(0, 4).join(', ')}
- Comprehensive OHLC data available for technical analysis

💡 **Key Investment Insights:**
${dataContext.insights.slice(0, 3).map(insight => `• ${insight.title}: ${insight.description}`).join('\n')}

Would you like me to analyze specific aspects like volatility, support levels, or trading volume patterns?`;
    }

    if (lowerMessage.includes('chart') || lowerMessage.includes('visualiz') || lowerMessage.includes('technical')) {
      return `Excellent! For stock analysis, here are the most valuable chart types:

📊 **Stock Chart Recommendations:**
• **OHLC Chart**: Shows open, high, low, close prices for comprehensive price action
• **Volume Analysis**: Identifies accumulation/distribution patterns
• **Price Trend**: Tracks momentum and directional movement
• **Daily Returns**: Analyzes volatility and risk patterns

🔍 **Technical Analysis Features:**
• Support and resistance level identification
• Volatility measurement and risk assessment
• Volume-price correlation analysis
• Trend strength and momentum indicators

The Charts tab displays these specialized stock visualizations. Which aspect of technical analysis interests you most?`;
    }

    if (lowerMessage.includes('buy') || lowerMessage.includes('sell') || lowerMessage.includes('invest') || lowerMessage.includes('trade')) {
      return `I can help analyze the data patterns, but remember that this is educational analysis only:

📊 **Data-Based Observations:**
${dataContext.insights.slice(0, 2).map(insight => `• ${insight.description}`).join('\n')}

🔍 **Technical Factors to Consider:**
• Price volatility and risk levels
• Volume trends and market interest
• Support/resistance levels from historical data
• Recent momentum and trend direction

⚠️ **Important Note:** This analysis is for educational purposes. Always consult with financial advisors and conduct thorough research before making investment decisions.

What specific technical aspects would you like to explore further?`;
    }

    return `I understand you're asking about: "${userMessage}"

As your stock market analyst, I can help you with:

📈 **Stock Analysis Questions:**
- "What's the price trend and momentum?"
- "How volatile is this stock?"
- "What are the support and resistance levels?"
- "How does volume correlate with price movements?"

💡 **Technical Analysis:**
- Price movement patterns and trends
- Volatility and risk assessment
- Volume analysis and market sentiment
- Key price levels and trading ranges

What aspect of the stock performance would you like to analyze first?`;
  }

  // Non-stock data responses
  if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
    return `Based on your dataset, here's what I can tell you:

📊 **Dataset Overview:**
- ${dataContext.summary.totalRows.toLocaleString()} total rows
- ${dataContext.summary.totalColumns} columns (${dataContext.summary.numericColumns} numeric, ${dataContext.summary.textColumns} text)
- Key numeric columns: ${dataContext.numericColumns.slice(0, 3).join(', ')}

🔍 **Top Insights:**
${dataContext.insights.slice(0, 3).map(insight => `• ${insight.title}: ${insight.description}`).join('\n')}

Would you like me to dive deeper into any specific aspect of your data?`;
  }

  if (lowerMessage.includes('chart') || lowerMessage.includes('visualiz')) {
    return `Great question! Based on your data structure, here are some visualization recommendations:

📈 **Recommended Charts:**
${dataContext.numericColumns.length >= 2 ? `• Scatter Plot: Compare ${dataContext.numericColumns[0]} vs ${dataContext.numericColumns[1]} to find correlations` : ''}
${dataContext.numericColumns.length >= 1 ? `• Bar Chart: Show distribution of ${dataContext.numericColumns[0]} values` : ''}
${dataContext.numericColumns.length >= 1 ? `• Line Chart: Track trends in ${dataContext.numericColumns[0]} over time` : ''}

The Charts tab already shows some of these visualizations. Would you like me to explain how to interpret any specific chart type?`;
  }

  return `I understand you're asking about: "${userMessage}"

Based on your dataset with ${dataContext.summary.totalRows.toLocaleString()} rows and ${dataContext.summary.totalColumns} columns, I can help you with:

🔍 **Data Analysis Questions:**
- "Give me a summary of this data"
- "What patterns do you see?"
- "Are there any outliers?"
- "What charts should I create?"

📊 **Specific Insights:**
- Statistical summaries of numeric columns
- Missing data analysis
- Correlation suggestions
- Data quality assessment

What would you like to explore first?`;
}
