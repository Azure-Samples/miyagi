# filename: plot_stock_prices.py
import matplotlib.pyplot as plt
import pandas as pd

# Replace these lists with the actual stock price data you have collected
dates = ['2024-01-01', '2024-01-02', '2024-01-03', '...']  # Add all dates YTD
meta_prices = [150, 153, 155, '...']  # Add corresponding META stock prices
tesla_prices = [700, 710, 720, '...']  # Add corresponding TESLA stock prices

# Create a DataFrame
data = {
    'Date': pd.to_datetime(dates),
    'META': meta_prices,
    'TESLA': tesla_prices
}
df = pd.DataFrame(data)
df.set_index('Date', inplace=True)

# Save the data to CSV
df.to_csv('stock_price_ytd.csv')

# Plot the stock price change YTD
plt.figure(figsize=(10, 5))
plt.plot(df.index, df['META'], label='META')
plt.plot(df.index, df['TESLA'], label='TESLA')
plt.title('Stock Price Change YTD')
plt.xlabel('Date')
plt.ylabel('Stock Price')
plt.legend()
plt.grid(True)

# Save the plot to a PNG file
plt.savefig('stock_price_ytd.png')
plt.show()