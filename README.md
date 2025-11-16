# 📈 Stock Market Analyzer

**Stock Market Analysis Platform with AI-Powered Insights**

A modern, full-featured web application for analyzing historical stock data with interactive charts, candlestick visualizations, and AI-powered investment insights.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6.svg)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Langton49/data-analysis-dashboard-munashe-mukweya
cd data-analysis-dashboard-munashe-mukweya

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional for AI features)
cp .env.example .env
# Add your OpenAI API key to .env

# 4. Start the development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:5173
```

---

## ✨ Features

### 📊 Professional Stock Charts
- **Candlestick Charts** - Professional OHLC visualization with ApexCharts
- **Price Movement Analysis** - Track closing and opening prices over time
- **Volume Analysis** - Visualize trading volume with intelligent scaling (K/M/B)
- **Daily Returns** - Color-coded percentage changes (green for gains, red for losses)
- **Full-Screen Mode** - Expand any chart for detailed analysis

### 🎯 Smart Data Processing
- **Automatic Date Sorting** - Chronological ordering for proper time-series analysis
- **Intelligent Volume Parsing** - Handles formats like "2,500,000", "2.5M", "1.2B"
- **Data Windowing** - Performance optimization for large datasets (1000+ records)
- **Interactive Navigation** - Scroll, zoom, and pan through your data
- **Complete Data Analysis** - Metrics calculated from full dataset

### 🎨 Professional UI/UX
- **Financial Color Coding** - Industry-standard green/red for gains/losses
- **Dark Mode Support** - Seamless theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Accessibility Compliant** - WCAG 2.1 AA standards
- **Minimalist Design** - Clean, professional interface

### 🤖 AI-Powered Insights
- **Investment Analysis** - AI-generated market insights and recommendations
- **Chat Interface** - Ask questions about your stock data
- **Trend Detection** - Automatic pattern recognition
- **Risk Assessment** - Volatility and risk metrics

### 📋 Data Management
- **Interactive Tables** - Sortable, color-coded financial data
- **Export Capabilities** - Download processed data and analysis reports
- **Multiple Format Support** - CSV with various volume formats
- **Data Quality Indicators** - Real-time completeness metrics

---

## 🛠️ Tech Stack

### Core Technologies
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.1** - Lightning-fast build tool
- **Tailwind CSS 3.4.11** - Utility-first styling

### Charting Libraries
- **Recharts 2.12.7** - React charting library for most visualizations
- **ApexCharts 3.x** - Professional candlestick charts
- **React-ApexCharts** - React wrapper for ApexCharts

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Shadcn/ui** - Pre-built component system

### AI Integration
- **OpenAI SDK** - AI-powered insights and chat

### State Management & Data
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Testing (Optional)
- **Jest** - Testing framework
- **React Testing Library** - Component testing

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** - Version 18.0.0 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node --version`

- **npm** - Version 8.0.0 or higher (comes with Node.js)
  - Verify: `npm --version`

### Optional
- **Git** - For version control
  - [Download Git](https://git-scm.com/)
  
- **VS Code** - Recommended code editor
  - [Download VS Code](https://code.visualstudio.com/)

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier - Code formatter
- TypeScript Importer

---

## 📦 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Langton49/data-analysis-dashboard-munashe-mukweya
cd data-analysis-dashboard-munashe-mukweya
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React and React DOM
- TypeScript
- Vite
- Recharts and ApexCharts
- Tailwind CSS
- All UI components and utilities

### Step 3: Environment Setup (Optional)
For AI features, create a `.env` file:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🎮 Running the Application

### Development Mode
```bash
npm run dev
```
- Opens at `http://localhost:8080`
- Hot module replacement enabled
- Development tools available

---

## 📊 How to Use

### 1. Upload Stock Data
- Click "Start Your Analysis" or drag and drop a CSV file
- Supported format: CSV with headers
- Required columns: `Date`, `Price`, `Open`, `High`, `Low`, `Vol.`, `Change%`

### 2. Explore the Dashboard
Navigate through different sections:
- **Market Overview** - Summary metrics and key charts
- **Stock Charts** - All visualizations including candlestick chart
- **Investment Insights** - AI-generated analysis
- **AI Analysis** - Chat with AI about your data
- **Stock Data** - Interactive data table

### 3. Analyze Charts
- **Expand Charts** - Click the expand icon for full-screen view
- **Navigate Data** - Use scroll and zoom controls
- **View Details** - Hover over data points for detailed information

### 4. Export Results
- **Export Stock Data** - Download processed CSV
- **Export Analysis Report** - Generate text report with insights

---

## 📁 Expected Data Format

### CSV Structure
```csv
Date,Price,Open,High,Low,Vol.,Change%
2024-01-02,150.25,148.50,152.10,147.80,2500000,1.2%
2024-01-03,152.80,150.25,154.20,149.90,2800000,1.7%
2024-01-04,149.60,152.80,153.50,148.20,3200000,-2.1%
```

### Column Descriptions
- **Date** - Trading date (YYYY-MM-DD format)
- **Price** - Closing price
- **Open** - Opening price
- **High** - Highest price of the day
- **Low** - Lowest price of the day
- **Vol.** - Trading volume (supports: 2500000, 2,500,000, 2.5M, etc.)
- **Change%** - Daily percentage change

### Sample Data
Sample files are included in the `sample-data/` folder:
- `stock-data.csv` - Basic historical data
- `extended-stock-data.csv` - Larger dataset
- `large-stock-data.csv` - Performance testing data

---

## 🏗️ Project Structure

```
stock-market-analyzer/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── ChartSection.tsx # Chart container
│   │   ├── CandlestickChart.tsx # Candlestick visualization
│   │   ├── DataTable.tsx    # Interactive data table
│   │   ├── InsightsPanel.tsx # AI insights display
│   │   ├── ChatInterface.tsx # AI chat
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Page components
│   │   └── Index.tsx        # Homepage
│   ├── utils/               # Utility functions
│   │   ├── dataAnalysis.ts  # Data processing
│   │   └── performance.ts   # Performance optimization
│   ├── lib/                 # External integrations
│   │   └── openai.ts        # AI integration
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   └── styles/              # Global styles
├── sample-data/             # Sample CSV files
├── docs/                    # Documentation
├── public/                  # Static assets
└── dist/                    # Production build (generated)
```

---

## 🎨 Key Features Explained

### Candlestick Chart
Professional OHLC visualization using ApexCharts:
- **Green candles** - Bullish days (close > open)
- **Red candles** - Bearish days (close < open)
- **Wicks** - Show high-low range
- **Bodies** - Show open-close range
- **Interactive tooltips** - Detailed OHLC data

### Chart Windowing
Performance optimization for large datasets:
- Shows last 10 records by default
- Navigate with scroll buttons (◀ ▶)
- Zoom in/out to adjust detail level
- Reset to default view
- Show all records option

### AI Integration
Powered by OpenAI:
- Market trend analysis
- Investment recommendations
- Risk assessment
- Pattern recognition
- Natural language queries

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# OpenAI API Key (optional - for AI features)
VITE_OPENAI_API_KEY=sk-...

# API Configuration (optional)
VITE_API_BASE_URL=https://api.openai.com/v1
```

### Tailwind Configuration
Customize colors and themes in `tailwind.config.js`

### Vite Configuration
Build settings in `vite.config.ts`

---


## 🎯 Browser Support

- **Chrome** - Latest 2 versions ✅
- **Firefox** - Latest 2 versions ✅
- **Safari** - Latest 2 versions ✅
- **Edge** - Latest 2 versions ✅

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Follow existing code patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 🐛 Troubleshooting

### Common Issues

**Issue: App won't start**
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Charts not displaying**
- Ensure CSV has required columns
- Check browser console for errors
- Verify data format matches expected structure

**Issue: AI features not working**
- Verify VITE_OPENAI_API_KEY is set in .env
- Check API key is valid
- Ensure you have API credits


### Try It Now
1. Start the app: `npm run dev`
2. Upload `sample-data/duolingo_stock_price_history.csv`
3. Explore the professional analysis dashboard
4. Try full-screen chart views
5. Chat with AI about stock performance

---

### Data Quality
- Recommended source for historic stock prices: https://www.investing.com/equities

