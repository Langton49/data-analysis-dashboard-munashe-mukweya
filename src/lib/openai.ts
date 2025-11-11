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
  const basePrompt = `You are a helpful data analysis assistant. You help users understand their dataset and answer questions about their data.

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
    return `${basePrompt}

Sample Data (first ${Math.min(100, dataContext.summary.totalRows)} rows in CSV format):
\`\`\`csv
${dataContext.sampleData}
\`\`\`

Guidelines:
1. Use the actual data above to answer specific questions about values, names, dates, etc.
2. When asked about specific records, search through the sample data provided
3. Provide clear, concise answers with specific examples from the data
4. If the answer requires data beyond the sample, mention that you're analyzing the first 100 rows
5. Suggest visualizations when appropriate
6. Explain statistical concepts in simple terms
7. Be helpful and encouraging
8. Keep responses focused and actionable`;
  }

  return `${basePrompt}

Guidelines:
1. Provide clear, concise answers about the data
2. Use the dataset context to give specific insights
3. Suggest visualizations when appropriate
4. Explain statistical concepts in simple terms
5. Be helpful and encouraging
6. Keep responses focused and actionable`;
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
  const prompt = `Analyze this dataset and provide:
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
