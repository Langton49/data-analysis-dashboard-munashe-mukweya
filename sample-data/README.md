# Sample Data Files for Stock Market Analysis Tool

This folder contains sample CSV files that students can use to test their Stock Market Analysis Tool application throughout the course.

## Available Sample Files

### 1. stock-data.csv ⭐ **PRIMARY DATASET**
**Purpose**: Historical stock market analysis (basic)
- **Columns**: Date, Price, Open, High, Low, Vol., Change%
- **Records**: 15 trading days of stock data
- **Use Cases**: 
  - Basic price trend analysis and momentum tracking
  - OHLC (Open, High, Low, Close) pattern recognition
  - Volume analysis and trading activity
  - Daily returns and volatility assessment
  - Support and resistance level identification

### 1b. extended-stock-data.csv 🚀 **EXTENDED DATASET**
**Purpose**: Historical stock market analysis (comprehensive)
- **Columns**: Date, Price, Open, High, Low, Vol., Change%
- **Records**: 50 trading days of stock data (Jan-Mar 2024)
- **Use Cases**: 
  - Advanced trend analysis with more data points
  - Long-term pattern recognition and seasonality
  - Comprehensive volatility analysis
  - Better statistical significance for insights
  - Testing chart performance with larger datasets

### 2. sales-data.csv
**Purpose**: Sales and revenue analysis (legacy dataset)
- **Columns**: Date, Product, Category, Revenue, Units_Sold, Customer_Segment, Region
- **Records**: 30 sales transactions
- **Use Cases**: 
  - Revenue trends over time
  - Product category performance
  - Regional sales analysis
  - Customer segment comparison

### 2. employee-data.csv
**Purpose**: HR and workforce analytics
- **Columns**: ID, Name, Age, Department, Salary, Years_Experience, Performance_Rating, Location, Education_Level
- **Records**: 25 employee records
- **Use Cases**:
  - Salary analysis by department
  - Performance vs experience correlation
  - Geographic distribution of workforce
  - Education level impact on compensation

### 3. weather-data.csv
**Purpose**: Environmental data analysis
- **Columns**: Date, Temperature, Humidity, Pressure, Wind_Speed, Precipitation, Air_Quality_Index, UV_Index, City
- **Records**: 30 weather observations across 3 cities
- **Use Cases**:
  - Temperature trends across cities
  - Air quality analysis
  - Weather pattern correlations
  - Climate comparison between locations

### 4. customer-data.csv
**Purpose**: Customer behavior and demographics
- **Columns**: User_ID, Age, Gender, Income, Education, Spending_Score, Brand_Preference, Purchase_Frequency, Online_Shopping, Social_Media_Hours
- **Records**: 25 customer profiles
- **Use Cases**:
  - Customer segmentation analysis
  - Spending behavior patterns
  - Demographics vs preferences
  - Digital engagement correlation

## How to Use These Files

### For Students:
1. **Start with stock-data.csv** - This is the primary dataset for the stock analysis tool
2. Download the CSV file to your computer
3. Open your Stock Market Analysis Tool application
4. Use the file upload feature to load the stock data
5. Explore the specialized stock visualizations (OHLC charts, volume analysis, price trends)
6. Try the AI-powered investment insights and market analysis features

### For Testing Features:
- **Data Upload**: Test CSV parsing and validation
- **Chart Generation**: Verify different chart types work with various data
- **Filtering**: Test filtering capabilities across different column types
- **Export**: Validate data export functionality
- **Error Handling**: Try uploading invalid files to test error messages

### Weekly Usage Guide:

**Week 3-4 (Basic Functionality)**:
- Start with stock-data.csv (specialized stock structure)
- Test stock chart creation and price data display
- Understand OHLC data format

**Week 5-6 (Advanced Features)**:
- Use stock-data.csv for volume analysis and trend identification
- Test different stock chart types (price trends, volume bars, daily returns)
- Implement stock-specific filtering and sorting

**Week 7-8 (Complex Analysis)**:
- Add AI-powered stock analysis features
- Use stock-data.csv for advanced financial metrics
- Implement investment insights and market analysis

**Week 9-10 (Final Project)**:
- Test with comprehensive stock datasets
- Demonstrate full stock analysis capabilities
- Create professional investment reports

## Data Characteristics

### Stock Data Types Represented:
- **Financial Prices**: Price, Open, High, Low (currency values)
- **Volume**: Trading volume (large integers)
- **Percentages**: Change% (percentage values with % symbol)
- **Date/Time**: Trading dates (YYYY-MM-DD format)
- **Calculated Metrics**: Daily returns, volatility, price ranges

### Data Complexity Levels:
- **Beginner**: stock-data.csv (standard OHLC format)
- **Intermediate**: Multiple stock symbols or longer time periods
- **Advanced**: Real-time data feeds or complex financial derivatives

## Troubleshooting Sample Data

### Common Issues:
1. **File Not Loading**: Ensure file is saved as .csv format
2. **Missing Charts**: Check that data columns are properly formatted
3. **Display Issues**: Verify column headers don't contain special characters

### Expected Behavior:
- All files should load without errors
- Charts should generate automatically upon upload
- Filtering should work on all categorical columns
- Export should maintain data integrity

## Creating Custom Test Data

Students can create their own stock CSV files following these guidelines:
- **Required columns**: Date, Price, Open, High, Low, Vol., Change%
- **Date format**: YYYY-MM-DD (e.g., 2024-01-15)
- **Price format**: Decimal numbers (e.g., 150.25)
- **Volume format**: Large integers (e.g., 2500000)
- **Change format**: Percentage with % symbol (e.g., 1.5% or -2.1%)
- Keep file size reasonable (under 1MB for testing)
- Ensure data quality (no missing values in key financial columns)

These sample files are designed to provide realistic, engaging stock market datasets that demonstrate the full capabilities of the Stock Market Analysis Tool while being simple enough for educational purposes.
