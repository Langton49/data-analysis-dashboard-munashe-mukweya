
import { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataRow } from '@/types/data';
import { generateDataInsights, getDataSummary, getNumericColumns } from '@/utils/dataAnalysis';
import { ChatSkeleton, ChatMessageSkeleton } from './skeletons';
import { generateSystemPrompt, getChatCompletion, getMockResponse, dataToCSV } from '@/lib/openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  data: DataRow[];
  messages: ChatMessage[];
  conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  onMessagesChange: (messages: ChatMessage[]) => void;
  onHistoryChange: (history: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) => void;
}

const ChatInterface = ({ data, messages, conversationHistory, onMessagesChange, onHistoryChange }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get API key from environment
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

  // Prepare data context (memoized to prevent unnecessary re-renders)
  const dataContext = useMemo(() => {
    const summary = getDataSummary(data);
    const insights = generateDataInsights(data);
    const numericColumns = getNumericColumns(data);

    // Determine sample size based on total rows (max 100, less for very large datasets)
    const sampleSize = Math.min(100, data.length);
    const sampleData = dataToCSV(data, sampleSize);

    return {
      summary,
      insights,
      numericColumns,
      sampleData,
    };
  }, [data]);

  // Initialize conversation with system prompt only if not already initialized
  useEffect(() => {
    if (conversationHistory.length === 0) {
      setIsInitializing(true);
      const systemPrompt = generateSystemPrompt(dataContext);
      onHistoryChange([{ role: 'system', content: systemPrompt }]);

      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // If conversation history exists, don't show skeleton
      setIsInitializing(false);
    }
  }, [conversationHistory.length, dataContext, onHistoryChange]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show skeleton during initialization
  if (isInitializing) {
    return <ChatSkeleton />;
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    onMessagesChange([...messages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Add user message to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user' as const, content: currentInput }
      ];

      let aiResponse: string;

      if (apiKey) {
        // Use real OpenAI API
        try {
          aiResponse = await getChatCompletion(updatedHistory, apiKey);
        } catch (apiError) {
          console.error('OpenAI API failed, using fallback:', apiError);
          // Fallback to mock response if API fails
          aiResponse = getMockResponse(currentInput, dataContext);
          setError('Using offline mode. Connect API key for AI-powered responses.');
        }
      } else {
        // No API key, use mock response
        aiResponse = getMockResponse(currentInput, dataContext);
        setError('No API key found. Using offline mode.');
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      onMessagesChange([...messages, userMessage, aiMessage]);

      // Update conversation history
      onHistoryChange([
        ...updatedHistory,
        { role: 'assistant', content: aiResponse }
      ]);

    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-base font-light">
          Chat
        </CardTitle>
        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
          Ask questions about your data
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {error && (
          <Alert variant="destructive" className="mb-4 flex-shrink-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 mb-4 min-h-0 pr-2" style={{ maxHeight: '100%' }}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-600 py-8">
              <Bot className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-light">Ask a question about your data</p>
              <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                <div className="border border-gray-200 dark:border-gray-800 p-2 rounded text-xs font-light">
                  "Give me a summary"
                </div>
                <div className="border border-gray-200 dark:border-gray-800 p-2 rounded text-xs font-light">
                  "What patterns do you see?"
                </div>
                <div className="border border-gray-200 dark:border-gray-800 p-2 rounded text-xs font-light">
                  "Are there any outliers?"
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] min-w-0 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-900'
                    }`}>
                    {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-lg p-3 min-w-0 break-words ${message.type === 'user'
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                    }`}>
                    {message.type === 'ai' ? (
                      <div className="text-sm font-light prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:font-light prose-headings:my-2 prose-code:text-xs prose-code:bg-gray-200 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-200 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-sm font-light whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</div>
                    )}
                    <div className="text-xs opacity-50 mt-2 font-light">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && <ChatMessageSkeleton />}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data... (e.g., 'What insights can you find?' or 'Explain the trends')"
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mt-2 text-center">
          💡 Press <kbd className="bg-muted px-1 rounded">Enter</kbd> to send • <kbd className="bg-muted px-1 rounded">Shift+Enter</kbd> for new line
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
