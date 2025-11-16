import { TrendingUp, AlertTriangle, BarChart3, Info, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataInsight, DataRow } from "@/types/data";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { InsightsSkeleton } from "./skeletons";
import { generateAIInsights, getMockInsights } from "@/lib/openai";
import { getDataSummary } from "@/utils/dataAnalysis";
import { useToast } from "@/hooks/use-toast";

// 📊 Week 4-5: Smart Data Insights - Bringing Your Data to Life
// Students - Transform raw data into meaningful stories! This component showcases professional data presentation patterns.
//
// Journey milestone: You've learned React basics (Weeks 1-3), now master data analysis and visualization!
//
// Learning objectives:
// - Build intelligent data analysis systems
// - Create engaging, accessible user interfaces
// - Master conditional rendering and dynamic styling
// - Present complex information clearly and beautifully

interface InsightsPanelProps {
	data: DataRow[];
	insights: DataInsight[];
	showAll?: boolean;
	aiInsights?: { summary: string; anomalies: string[] };
	onAiInsightsChange?: (insights: { summary: string; anomalies: string[] } | undefined) => void;
}

const InsightsPanel = ({
	data,
	insights,
	showAll = false,
	aiInsights,
	onAiInsightsChange,
}: InsightsPanelProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const { toast } = useToast();

	// Simulate insights generation
	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 700);
		return () => clearTimeout(timer);
	}, [data, insights]);

	// Show skeleton while loading
	if (isLoading) {
		return <InsightsSkeleton count={showAll ? insights.length : 6} />;
	}
	// 🟢 EASY - Week 3: Icon Mapping Function
	// TODO: Students - Understand switch statements and icon libraries
	//
	// What's happening here:
	// - We have different types of insights (trend, outlier, correlation)
	// - Each type needs a different icon to help users understand quickly
	// - Instead of writing if/else statements everywhere, we use one function
	//
	// Why do we use a function instead of inline conditionals?
	// - Reusability: We can use this function anywhere we need insight icons
	// - Maintainability: If we want to change an icon, we only change it here
	// - Readability: The code is cleaner and easier to understand
	//
	// Try this: Add a new insight type and its icon!
	const getInsightIcon = (type: DataInsight["type"]) => {
		switch (type) {
			case "trend":
				return <TrendingUp className="h-4 w-4" />;
			case "outlier":
				return <AlertTriangle className="h-4 w-4" />;
			case "correlation":
				return <BarChart3 className="h-4 w-4" />;
			default:
				return <Info className="h-4 w-4" />;
		}
		// TODO: Week 4 - Add more insight types (seasonal, anomaly, prediction)
	};

	// 🟢 EASY - Week 3: Dynamic Styling Function
	// TODO: Students - Learn about dynamic CSS classes
	//
	// What's happening here:
	// - Different insight types get different colored badges
	// - Trends are green (positive), outliers are yellow (caution), etc.
	// - We use Tailwind CSS classes to apply colors
	//
	// How does this create different colored badges for different insight types?
	// - The function returns different CSS class strings based on the insight type
	// - These classes are applied to the badge component
	// - Tailwind CSS interprets these classes and applies the appropriate styles
	//
	// Try this: Change the colors or add new insight types with their own colors!
	const getInsightColor = (type: DataInsight["type"]) => {
		switch (type) {
			case "trend":
				return "bg-green-100 text-green-800";
			case "outlier":
				return "bg-yellow-100 text-yellow-800";
			case "correlation":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
		// TODO: Week 4 - Make colors configurable or theme-aware
	};

	const handleGenerateInsight = async () => {
		setIsGenerating(true);

		try {
			// Get API key from environment
			const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

			// Prepare data context
			const summary = getDataSummary(data);
			const numericColumns = Object.entries(summary.columnTypes)
				.filter(([_, type]) => type === 'numeric')
				.map(([col]) => col);

			const dataContext = {
				summary,
				insights: insights.slice(0, 5),
				numericColumns
			};

			let result;

			if (!apiKey) {
				// Use fallback if no API key
				toast({
					title: "Using Offline Mode",
					description: "Add VITE_OPENAI_API_KEY to .env for AI-powered insights",
					variant: "default"
				});
				result = getMockInsights(dataContext);
			} else {
				// Call OpenAI API
				result = await generateAIInsights(dataContext, apiKey);
				toast({
					title: "AI Insights Generated",
					description: "Successfully analyzed your dataset",
					variant: "default"
				});
			}

			if (onAiInsightsChange) {
				onAiInsightsChange(result);
			}
		} catch (error) {
			console.error('Error generating insights:', error);
			toast({
				title: "Error",
				description: "Failed to generate insights. Using fallback analysis.",
				variant: "destructive"
			});

			// Fallback to mock insights
			const summary = getDataSummary(data);
			const numericColumns = Object.entries(summary.columnTypes)
				.filter(([_, type]) => type === 'numeric')
				.map(([col]) => col);

			const fallbackInsights = getMockInsights({
				summary,
				insights: insights.slice(0, 5),
				numericColumns
			});

			if (onAiInsightsChange) {
				onAiInsightsChange(fallbackInsights);
			}
		} finally {
			setIsGenerating(false);
		}
	};

	// 🟢 EASY - Week 3: Empty State Handling
	// TODO: Students - Always handle empty states gracefully
	//
	// What's happening here:
	// - Before showing insights, we check if there are any insights to show
	// - If the insights array is empty, we show a helpful message instead
	// - This prevents the user from seeing a blank, confusing screen
	//
	// What makes a good empty state?
	// - Helpful messaging that explains why it's empty
	// - Clear next steps for the user
	// - Consistent styling with the rest of the app
	//
	// Real-world example: Think of when you open a new email app - it doesn't show
	// nothing, it shows "No emails yet" with instructions on how to get started
	if (insights.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Insights</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-gray-500 text-center py-8">
						No insights available. Upload data to see automated analysis.
					</p>
					{/* TODO: Week 3 - Add loading skeleton when processing data */}
					{/* TODO: Week 4 - Add tips about what kind of data works best */}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-gray-200 dark:border-gray-800">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className="text-base font-light">Insights</span>
					<Button
						onClick={handleGenerateInsight}
						disabled={isGenerating}
						variant="ghost"
						size="sm"
						className="font-light text-xs"
					>
						<Sparkles className="h-3 w-3 mr-1.5" />
						{isGenerating ? "Generating..." : "AI"}
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{aiInsights && (
					<div className="mb-6 border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
						<div className="flex items-center gap-2 mb-2">
							<Sparkles className="h-4 w-4 text-gray-900 dark:text-gray-100" />
							<h4 className="text-sm font-light">AI Analysis</h4>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed font-light">
							{aiInsights.summary}
						</p>
						<div className="space-y-1.5">
							{aiInsights.anomalies.map((anomaly, idx) => (
								<div key={idx} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-500">
									<span className="mt-1">•</span>
									<span className="flex-1 font-light">{anomaly}</span>
								</div>
							))}
						</div>
					</div>
				)}
				<div className="space-y-4">
					{/* 🟡 MEDIUM - Week 4: Dynamic List Rendering */}
					{/* TODO: Students - Understand array mapping and complex layouts */}
					{/* 
          What's happening here:
          - We have an array of insights
          - We want to display each insight as a card
          - We use the .map() function to transform each insight into JSX
          - Each insight gets its own card with icon, title, description, etc.
          
          Why use .map() instead of writing each card manually?
          - Dynamic: Works with any number of insights
          - Maintainable: Change the layout once, applies to all insights
          - Scalable: Can handle 10 insights or 1000 insights
          
          The 'key' prop is important for React's performance optimization
          */}
					{insights.map((insight, index) => (
						<div
							key={index}
							className="border-b border-gray-100 dark:border-gray-900 pb-4 last:border-0"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex-1">
									<h4 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-1">
										{insight.title}
									</h4>
									<p className="text-xs text-gray-500 dark:text-gray-500 font-light leading-relaxed">
										{insight.description}
									</p>
									{insight.value && (
										<span className="inline-block mt-2 text-xs text-gray-400 dark:text-gray-600 font-light">
											{insight.value}
										</span>
									)}
								</div>
								
							</div>
						</div>
					))}

					{/* 🟢 EASY - Week 4: Pagination/Truncation Logic */}
					{/* TODO: Students - Understand user experience for long lists */}
					{/* 
          What's happening here:
          - If there are more than 4 insights and we're not showing all
          - We display a message about how many more are available
          - This prevents the interface from becoming overwhelming
          
          Why limit what we show?
          - Too much information can be overwhelming
          - Keeps the interface clean and focused
          - Encourages users to explore more deliberately
          
          Real-world example: Google shows 10 results per page, not 1000
          */}
					{!showAll && insights.length > 4 && (
						<div className="text-center pt-2">
							<p className="text-xs text-gray-400 dark:text-gray-600 font-light">
								+{insights.length - 4} more insights
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default InsightsPanel;

// 🔴 ADVANCED - Week 6-8: Component Enhancement Ideas
// TODO: Students - Pick advanced features to implement:
//
// 1. Interactive Insights
//    - Click to explore insight in detail
//    - Generate related charts on demand
//    - Filter data based on insight
//
// 2. Insight Management
//    - Save/bookmark important insights
//    - Share insights with others
//    - Export insights to reports
//
// 3. Advanced Analytics
//    - Trend prediction
//    - Comparative analysis
//    - Statistical significance testing
//
// 4. User Customization
//    - Choose which insight types to show
//    - Set confidence thresholds
//    - Custom insight templates
