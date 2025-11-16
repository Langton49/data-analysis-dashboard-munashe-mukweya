
# 📈 Stock Data Analyzer: Professional Stock Market Analysis Platform

**Upload historical stock data and get comprehensive market analysis with interactive charts and AI-powered investment insights**

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# Go to http://localhost:8080
```

## 🎯 Getting Started

### For Students: Using This Template

**This repository is a GitHub template designed for classroom use.**

#### Option 1: Use GitHub Template (Recommended)
1. **Click the green "Use this template" button** at the top of this repository
2. **Create your own repository** with a descriptive name
3. **Clone your new repository** to your computer
4. **Follow the setup instructions** in [Student Setup Guide](docs/template-setup/STUDENT_SETUP_GUIDE.md)

#### Option 2: Direct Clone (Not Recommended for Students)
If you just want to try the project without classroom features:
```bash
git clone https://github.com/YOUR_INSTRUCTOR/TEMPLATE_REPO.git
cd TEMPLATE_REPO
npm install
npm run dev
```

### Prerequisites

Before starting, ensure you have:

#### Required Software
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/downloads)  
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **GitHub Account** - [Sign up here](https://github.com)

#### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets** - React code shortcuts
- **Auto Rename Tag** - Automatically renames paired HTML/JSX tags
- **Prettier - Code formatter** - Keeps your code neat and consistent
- **TypeScript Importer** - Helps with import statements
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes

#### Verify Your Setup
```bash
# Check versions (all should work)
node --version  # Should be 18+
npm --version   # Should be 8+
git --version   # Any recent version
```

### 📚 Complete Setup Documentation
- **[Student Setup Guide](docs/template-setup/STUDENT_SETUP_GUIDE.md)** - How to use this template and get updates
- **[Git Workflow Tutorial](docs/template-setup/GIT_WORKFLOW_TUTORIAL.md)** - Learn Git while building your project
- **[Troubleshooting Guide](docs/template-setup/TROUBLESHOOTING_GUIDE.md)** - Solve common issues quickly

## 📖 What You'll Build

You're building a **professional stock market analysis platform** that transforms raw stock data into actionable investment insights:

### 🎯 Core Features
- **📊 Professional Stock Charts**: OHLC analysis, volume trends, price movements, and daily returns
- **🔍 Full-Screen Analysis**: Expandable charts with enhanced detail and interactive controls  
- **📈 Smart Data Processing**: Automatic chronological sorting and intelligent volume parsing
- **🎨 Financial Color Coding**: Industry-standard green/red for gains/losses, professional styling
- **🤖 AI Investment Insights**: Chat interface for market analysis and investment recommendations
- **📋 Interactive Data Tables**: Color-coded financial metrics with smart date sorting
- **⚡ Performance Optimized**: Handles large datasets with windowing and navigation controls

### 📁 Expected Data Format
Your CSV files should include these columns:
- **Date**: Trading date (YYYY-MM-DD format)
- **Price**: Closing price
- **Open**: Opening price  
- **High**: Highest price of the day
- **Low**: Lowest price of the day
- **Vol.**: Trading volume (supports formats like 2,500,000 or 2.5M)
- **Change%**: Daily percentage change

## 🎯 What This Project Teaches You

### React & TypeScript Fundamentals
- Creating and composing components
- Managing state and data flow
- Handling user interactions and file uploads
- Adding types for reliability and better development experience

### Stock Market Analysis & Visualization
- Processing and analyzing historical stock data
- Creating specialized financial charts (OHLC, volume, trends)
- Generating investment insights and market analysis
- Building responsive, professional trading interfaces

### Professional Development Skills
- Working with APIs and external services
- Error handling and user experience design
- Code organization and best practices
- Testing, debugging, and deployment

## 📚 10-Week Progressive Learning Journey

This course is designed as a complete 10-week experience where you'll build a professional-grade stock market analysis platform. Each week builds naturally on the previous, with a smooth progression from fundamental React concepts to advanced financial data visualization and AI-powered investment insights.

### 🏗️ Foundation Phase (Weeks 1-4): Getting Started

#### Week 1: Project Setup & React Basics 🟢 EASY
**What you'll learn:**
- React fundamentals (components, JSX, props)
- Project structure and development workflow
- Basic TypeScript concepts

**What you'll build:**
- Get the project running locally
- Understand the existing codebase structure
- Make your first component modifications
- Set up your development environment

**Success milestone:** You can run the project and understand how React components work together

#### Week 2: Data Flow & State Management 🟢 EASY
**What you'll learn:**
- How data moves through React applications
- State management with useState
- Working with JavaScript arrays and objects

**What you'll build:**
- Enhance the file upload component
- Add basic data validation
- Implement simple state updates
- Create loading and error states

**Success milestone:** You understand how data flows from upload to display

#### Week 3: Interactive Components 🟡 MEDIUM
**What you'll learn:**
- Event handling and user interactions
- Conditional rendering and dynamic content
- Form handling and controlled components

**What you'll build:**
- Add search and filter functionality to data tables
- Implement sorting capabilities
- Create responsive UI components
- Add user feedback for actions

**Success milestone:** Your app responds to user interactions smoothly

#### Week 4: Data Processing & Analysis 🟡 MEDIUM
**What you'll learn:**
- Data manipulation and transformation
- Basic statistical calculations
- Error handling and edge cases

**What you'll build:**
- Implement data analysis functions
- Add data export functionality
- Create summary statistics
- Handle various CSV formats

**Success milestone:** Your app can process and analyze uploaded data

### 📊 Visualization Phase (Weeks 5-6): Making Data Beautiful

#### Week 5: Charts & Visualizations 🟡 MEDIUM
**What you'll learn:**
- Data visualization principles
- Working with the Recharts library
- Responsive chart design

**What you'll build:**
- Create bar, line, and pie charts
- Make charts interactive and responsive
- Add chart customization options
- Implement chart export features

**Success milestone:** Your data comes alive with interactive visualizations

#### Week 6: Insights & Intelligence 🟡 MEDIUM
**What you'll learn:**
- Pattern recognition in data
- Generating automated insights
- User experience for data presentation

**What you'll build:**
- Enhanced insight generation algorithms
- Better data summary presentations
- Automated trend detection
- Professional dashboard layout

**Success milestone:** Your dashboard provides valuable insights automatically

### 🚀 Professional Phase (Weeks 7-8): Adding Intelligence

#### Week 7: API Integration & AI Features 🟠 CHALLENGING
**What you'll learn:**
- Working with external APIs
- Async programming in JavaScript
- Managing API keys and environment variables

**What you'll build:**
- Connect to an AI service (OpenAI/Anthropic)
- Implement the chat interface
- Send data context to AI
- Handle API responses and errors

**If you're struggling:** Start with mock AI responses to learn the patterns without API complexity
**For fast learners:** Explore multiple AI providers and compare responses

**Success milestone:** Users can ask questions about their data and get intelligent responses

#### Week 8: Polish & Performance 🟠 CHALLENGING
**What you'll learn:**
- Performance optimization techniques
- Advanced error handling strategies
- User experience improvements

**What you'll build:**
- Add loading states and progress indicators
- Implement comprehensive error handling
- Optimize chart rendering performance
- Add data caching and optimization

**If you're struggling:** Focus on one improvement at a time - loading states first, then error handling
**For fast learners:** Implement advanced features like data streaming or real-time updates

**Success milestone:** Your app feels fast, reliable, and professional

### 🎯 Mastery Phase (Weeks 9-10): Launch Ready

#### Week 9: Testing & Quality Assurance 🟠 CHALLENGING
**What you'll learn:**
- Testing strategies for React applications
- Debugging techniques and tools
- Code review and quality practices

**What you'll build:**
- Test your app with various data types
- Fix edge cases and bugs
- Improve code organization
- Add comprehensive error boundaries

**If you're struggling:** Focus on manual testing first - try breaking your app in different ways
**For fast learners:** Implement automated tests or add accessibility features

**Success milestone:** Your app handles edge cases gracefully and is thoroughly tested

#### Week 10: Deployment & Portfolio Presentation 🟢 EASY
**What you'll learn:**
- Deployment strategies and best practices
- Creating effective project documentation
- Portfolio presentation skills

**What you'll build:**
- Deploy your app to a live URL
- Create compelling project documentation
- Prepare a demo presentation
- Plan your next learning steps

**Success milestone:** Your professional data analysis platform is live and ready to showcase!

---

## 🆘 Support Throughout Your Journey

### If You're Struggling
- **Week 1-3:** Focus on understanding one concept at a time. Don't worry about perfection.
- **Week 4-6:** Use console.log extensively to understand data flow. Ask for help early.
- **Week 7-8:** Consider mock implementations first before adding real API calls.
- **Week 9-10:** Remember that debugging is a skill - every bug you fix makes you stronger.

### For Fast Learners
- **Week 1-3:** Explore additional React patterns and TypeScript features.
- **Week 4-6:** Try implementing additional chart types or statistical functions.
- **Week 7-8:** Experiment with multiple AI providers or advanced prompt engineering.
- **Week 9-10:** Add advanced features like real-time collaboration or mobile optimization.

### Peer Support Strategies
- Form study groups with classmates
- Share interesting data insights you discover
- Help debug each other's code
- Present your progress weekly to build confidence

## 📊 Sample Data & Getting Started

### 🎯 Try It Now
The project includes sample stock data files in the `sample-data/` folder:
- `stock-data.csv` - Basic historical stock data
- `extended-stock-data.csv` - Larger dataset for testing performance features
- `large-stock-data.csv` - Comprehensive dataset for advanced analysis

### 📁 Data Format Example
```csv
Date,Price,Open,High,Low,Vol.,Change%
2024-01-02,150.25,148.50,152.10,147.80,2500000,1.2%
2024-01-03,152.80,150.25,154.20,149.90,2800000,1.7%
2024-01-04,149.60,152.80,153.50,148.20,3200000,-2.1%
```

### 🚀 Quick Demo
1. Start the app: `npm run dev`
2. Upload any file from `sample-data/`
3. Explore the professional stock analysis dashboard
4. Try the full-screen chart views
5. Chat with AI about the stock performance

## 🚀 Free Deployment Options

### Option 1: Vercel (Recommended)
```bash
# 1. Push your code to GitHub
# 2. Visit vercel.com and sign up with GitHub
# 3. Import your repository
# 4. Deploy with one click
```

### Option 2: Netlify
```bash
# 1. Build your project
npm run build

# 2. Visit netlify.com
# 3. Drag and drop the 'dist' folder
# 4. Your app is live!
```

### Option 3: GitHub Pages
```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
"deploy": "gh-pages -d dist"

# 3. Deploy
npm run build && npm run deploy
```

## 🤔 What Each File Does

### Main App Files
- `src/App.tsx` - The main app that holds everything together
- `src/main.tsx` - Starts the React app (you won't need to change this much)
- `src/index.css` - Global styles for the whole app

### Components (UI Pieces)
- `src/components/DataUpload.tsx` - The file upload area
- `src/components/DataTable.tsx` - Shows data in a table
- `src/components/ChartSection.tsx` - Creates charts from data
- `src/components/InsightsPanel.tsx` - Shows interesting facts about data
- `src/components/ChatInterface.tsx` - AI chat feature
- `src/components/Dashboard.tsx` - Main dashboard that combines everything

### Utilities (Helper Functions)
- `src/utils/dataAnalysis.ts` - Functions that analyze and process data
- `src/types/data.ts` - TypeScript definitions for data structures

### UI Components
- `src/components/ui/` - Pre-built UI components (buttons, cards, etc.)

## 🆘 Need Help?

### If the app won't start:
1. Make sure you have Node.js installed
2. Run `npm install` to install dependencies
3. Check for error messages in the terminal

### If you're stuck on code:
1. Check the `HINTS.md` file for solutions
2. Look at the TODO comments in the code
3. Ask your instructor or classmates

### If you want to see a working example:
Switch to the `solution` branch to see completed features:
```bash
git checkout solution
```

## 🎉 What Success Looks Like

By the end of this 10-week journey, you'll have:
- **A professional data analysis platform** deployed live on the web
- **Solid React and TypeScript skills** that transfer to other projects
- **Experience with real-world development practices** including APIs, testing, and deployment
- **A portfolio project** that demonstrates your capabilities to employers
- **Confidence to tackle new web development challenges** independently

## 📚 Additional Resources

- [React Official Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)

---

**Remember:** This is a journey of growth! Every developer started where you are now. Focus on progress, not perfection, and celebrate each milestone along the way.

## 🔍 **New Feature: Full-Screen Chart Analysis**

### **Enhanced Chart Viewing Experience**
Each chart now includes a **full-screen mode** for detailed analysis:

- **📊 Expand Button**: Look for the expand icon (⛶) in the top-right corner of each chart
- **🖥️ Full-Screen View**: Charts open in a modal overlay covering the entire screen
- **📈 Enhanced Details**: Full-screen charts are larger with improved readability
- **⌨️ Easy Navigation**: Press `ESC` key or click the X button to close
- **🎯 Better Analysis**: Perfect for detailed technical analysis and pattern recognition

### **Available in Full-Screen**:
- **Price Movement Chart**: Detailed price and open price trends
- **Trading Volume Chart**: Enhanced volume analysis with better scaling
- **OHLC Analysis**: Comprehensive Open, High, Low, Close visualization
- **Daily Returns Chart**: Detailed percentage change analysis

### **How to Use**:
1. Upload your stock data (CSV with Date, Price, Open, High, Low, Vol., Change% columns)
2. Navigate to any chart in the dashboard
3. Click the expand button (⛶) in the chart header
4. Enjoy detailed full-screen analysis
5. Press ESC or click X to return to dashboard view

This feature makes it easier to spot trends, analyze patterns, and make informed investment decisions with your stock data!

## 📊 **Complete Data Visualization**

### **All Your Data, All the Time**
Charts now display **all records** from your CSV file:

- **🔄 No More Limits**: Previously limited to 15-50 records, now shows everything
- **📈 Complete Trends**: See the full picture of your stock's performance
- **🎯 Better Analysis**: Make decisions based on complete data, not samples
- **⚡ Smart Performance**: Automatic optimization for large datasets (1000+ records)

### **Intelligent Data Handling**:
- **Chronological Sorting**: Data automatically sorted by date (oldest to newest) for proper trend analysis
- **Smart Windowing**: Shows last 10 records by default for optimal performance
- **Interactive Navigation**: Scroll and zoom controls to explore all data
- **Performance Optimized**: Smooth charts regardless of dataset size
- **Full Analysis**: Metrics calculated from complete dataset while showing windowed view

### **Chart Navigation Controls**:
- **◀▶ Scroll**: Navigate through time periods
- **🔍 Zoom In/Out**: Adjust detail level (5-50+ records)
- **🔄 Reset**: Return to last 10 records view
- **📊 Show All**: Display entire dataset
- **🖥️ Full-Screen**: Same controls available in expanded chart view

See the complete guides:
- [Chart Data Handling Guide](docs/CHART_DATA_HANDLING.md) - Data processing details
- [Chart Windowing Guide](docs/CHART_WINDOWING.md) - Navigation and performance features

## 🎨 **Enhanced Color Scheme for Better Analysis**

### **Professional Financial Colors**
The app now uses a sophisticated color scheme designed specifically for stock market analysis:

- **🟢 Green**: Bullish trends, gains, support levels (positive performance)
- **🔴 Red**: Bearish trends, losses, resistance levels (negative performance)  
- **🔵 Blue**: Primary price data, closing prices (main information)
- **🟦 Cyan**: Trading volume, market activity (liquidity indicators)
- **🟣 Purple**: Volatility, risk metrics (uncertainty measures)
- **⚫ Gray**: Reference data, opening prices (baseline information)

### **Smart Color Features**:
- **Dynamic Coloring**: Daily returns automatically show green for gains, red for losses
- **Dark Mode Optimized**: All colors adapt beautifully for dark theme users
- **Accessibility Friendly**: High contrast ratios and colorblind-safe combinations
- **Industry Standard**: Follows traditional financial charting conventions

### **Color-Coded Metrics Panel**:
Each key metric now has its own themed color card for instant recognition and better visual hierarchy.

### **Enhanced Data Table**:
The data table now features intelligent color coding and smart date sorting:

**Color Coding:**
- **🔵 Blue Headers & Values**: Price data (Close, Current Price)
- **🟦 Cyan**: Volume data and trading activity
- **🟢 Green**: Positive changes, gains, high prices
- **🔴 Red**: Negative changes, losses, low prices
- **🟣 Purple**: Change percentages and volatility
- **Smart Backgrounds**: Subtle highlighting for positive/negative returns

**Smart Date Sorting:**
- **📅 Chronological Order**: Date columns sort properly (not alphabetically)
- **🔍 Auto-Detection**: Automatically recognizes date columns and formats
- **📊 Proper Analysis**: Enables correct time-series data navigation

See the complete guides:
- [Color Scheme Guide](docs/COLOR_SCHEME_GUIDE.md) - Chart color meanings and usage
- [Table Color Guide](docs/TABLE_COLOR_GUIDE.md) - Data table color enhancements
- [Date Sorting Fix](docs/DATE_SORTING_FIX.md) - Chronological date sorting in tables
