# Why Do Consumers Feel Rising Inflation?

## Overview

This project is a data narrative investigating how inflation is experienced through everyday consumer costs. Instead of treating inflation as one abstract national number, the project breaks it into four categories: overall and energy CPI, housing CPI, food CPI, and transportation CPI. We then compare them to existing sources including news article and journalism that highlights the causes of abnormal patterns. The sections as a whole show how different parts of daily life carried different forms of price pressure from recent years through 2026.

The project uses public CPI data from the U.S. Bureau of Labor Statistics through FRED, along with supporting sources and economic reporting to explain major changes in the data. The final page was published as a single GitHub Pages site with multiple visualizations combined into one scrolling narrative.

## Project Question

Why do consumers feel rising inflation, and how does current inflation compare to previous years?

## Visualizations

![CPI Inflation Narrative](images/CPI%20Inflation%20Data%20Narrative%20Project%20Image.png)

### Overall and Energy CPI

The first section compares overall consumer prices with energy prices from 2023 to 2026. The visualization uses a Flourish chart to show that overall CPI rose more steadily, while energy CPI was more volatile and surged sharply in early 2026. This section connects the energy spike to geopolitical instability and oil market pressure.

### Housing CPI

The housing section uses D3 to visualize year-over-year shelter CPI change from 2019 to 2026. It includes a shaded 2024-present period, a pre-pandemic average reference line, and annotations for major housing inflation moments. The section explains how housing inflation remained persistent because of housing shortages, delayed shelter CPI measurement, and construction cost pressures.

### Food CPI

The food section uses D3 to show the monthly U.S. Food CPI index from 2024 to 2026. The visualization emphasizes that food prices stayed high even when the pace of growth slowed. The section also notes that external pressures such as geopolitical conflict, labor shortages, and supply chain disruptions continued to affect food costs.

### Transportation CPI

The transportation section uses D3 to show monthly percent change in Transportation CPI from January 2024 to April 2026. The chart highlights March and April 2026, when transportation inflation rose sharply. Supporting sources connect this spike to gasoline, airfare, fuel costs, the Iran war, and the Trump administration’s public response to rising inflation.

## Data Sources

The project uses the following datasets:

* Consumer Price Index for All Urban Consumers: All Items in U.S. City Average
* Consumer Price Index for All Urban Consumers: Energy in U.S. City Average
* Consumer Price Index for All Urban Consumers: Shelter in U.S. City Average
* Consumer Price Index for All Urban Consumers: Food in U.S. City Average
* Consumer Price Index for All Urban Consumers: Transportation in U.S. City Average

All CPI data comes from the U.S. Bureau of Labor Statistics and was accessed through FRED, Federal Reserve Bank of St. Louis.

* U.S. Bureau of Labor Statistics. Consumer Price Index for All Urban Consumers: All Items in U.S. City Average (CPIAUCSL). Retrieved from FRED, Federal Reserve Bank of St. Louis. https://fred.stlouisfed.org/series/CPIAUCSL.

* U.S. Bureau of Labor Statistics. Consumer Price Index for All Urban Consumers: Food in U.S. City Average (CPIUFDSL). Retrieved from FRED, Federal Reserve Bank of St. Louis. https://fred.stlouisfed.org/series/CPIUFDSL.

* U.S. Bureau of Labor Statistics. Consumer Price Index for All Urban Consumers: Energy in U.S. City Average (CPIENGSL). Retrieved from FRED, Federal Reserve Bank of St. Louis. https://fred.stlouisfed.org/series/CPIENGSL.

* U.S. Bureau of Labor Statistics. Consumer Price Index for All Urban Consumers: Shelter in U.S. City Average (CUSR0000SAH1). Retrieved from FRED, Federal Reserve Bank of St. Louis. https://fred.stlouisfed.org/series/CUSR0000SAH1.

* U.S. Bureau of Labor Statistics. “Consumer Price Index for All Urban Consumers: Transportation in U.S. City Average.” Retrieved from FRED, Federal Reserve Bank of St. Louis, May 26, 2026. https://fred.stlouisfed.org/series/CPITRNSL.

Along with sources to support our narrative:

* Cunningham, M. “CPI Report Shows Inflation Surged in March as Iran War Drove Up Energy Costs.” CBS News. April 10, 2026. https://www.cbsnews.com/news/cpi-report-today-march-2026-inflation-iran-war-trump/.

* Guardian staff and agencies. “US Inflation Rose at Fastest Pace in Three Years in April as Iran War Hikes Up Prices. The Guardian. May 28, 2026. https://www.theguardian.com/business/2026/may/28/inflation-increased-april-iran-war-price-rises.

* Kilian, L., Plante, M., Richter, A.W., Zhou, X. “Implications of the Iran War for U.S. Inflation.” Federal Reserve Bank of Dallas. April 17, 2026. https://www.dallasfed.org/research/economics/2026/0417.

* Pino, I. “March CPI Breakdown: Iran War Sends Gas Prices Skyrocketing, Airfare Climbing.” Yahoo Finance. April 10, 2026. https://finance.yahoo.com/personal-finance/banking/article/march-cpi-breakdown-iran-war-sends-gas-prices-skyrocketing-airfare-climbing-142208770.html.

* Qiu, L. “Trump Cites Inaccurate Data to Downplay Economic Toll of Iran War.” The New York Times, May 14, 2026. https://www.nytimes.com/2026/05/14/us/politics/trump-iran-war-economy-cost.html.

* Rugaber, C. “A Key Inflation Gauge Jumps in March as Iran War-Driven Gas Prices Squeeze Budgets.” Associated Press. April 30, 2026. https://apnews.com/article/consumer-prices-gas-inflation-5c2037950e57d8e5d402a40b8fc41384.
  
* Bussewitz, C. Gasoline costs 50% more in the US than it did before the Iran war. Associated Press. May 5, 2025. https://apnews.com/article/gasoline-oil-war-iran-strait-of-hormuz-0e5b61be4a4c8a8a077ed5ff6f84c0ce.
  
* David, J.E. "Wild" housing market leaves renters, buyers fewer choices. Axios. June 18, 2022. https://www.axios.com/2022/06/18/affordable-housing-shortage-tiny-homes.
  
* Ball, L.M., Koh, K.W. Understanding the Lag Between CPI Shelter Inflation and Market Rents. National Bureau of Economic Research. October 1, 2025. https://www.nber.org/digest/202510/understanding-lag-between-cpi-shelter-inflation-and-market-rents?page=1&perPage=50.

* Bartash, J. Shelter from inflation? CPI not showing much sign of it lately. MarketWatch. May 13, 2025. https://www.marketwatch.com/story/shelter-from-inflation-cpi-not-showing-much-sign-of-it-lately-369a2d39. 

## Tools Used

* HTML
* CSS
* JavaScript
* D3.js
* Flourish
* GitHub Pages
* Python for data processing

## File Structure

```
cpi-inflation-narrative
│
├── data
│   ├── housing2018-2026.csv
│   ├── 2024to2026FoodInflation.csv
│   ├── transportation_cpi_2024_2026_processed.csv
│   └── energy and overall data files.xlsx
│
├── images
│   └── page_image.png
│
├── javascript
│   └── script.js
│
├── notebooks
│   └── Siwon_Lee_Transportation_Data_Processing_Notebook
│
│   CSS
│   └── style.css
│
├── index.html
└── README.md
```

## Notes

Some sections use D3 charts built directly from CSV files, while the overall and energy section uses a Flourish embed. The final version combines all visualizations into a single GitHub Pages-ready project so viewers can move through the inflation story in one place.

## Authors

* James Chen
* Ryan Mathew
* Siwon Lee
* Samantha Tai

University of Washington Bothell