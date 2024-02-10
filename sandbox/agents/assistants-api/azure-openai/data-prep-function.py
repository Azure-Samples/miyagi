import yfinance as yf
import csv
import os

def create_dcf_analysis_csv(ticker, start_year, end_year, projected_revenue_growth_rate, wacc, file_name):
    # Fetch historical data
    company = yf.Ticker(ticker)
    financials = company.financials
    revenue = financials.loc['Total Revenue']
    
    # Function to calculate projected values
    def calculate_projected_values(initial_value, growth_rate, years):
        return [initial_value * ((1 + growth_rate) ** year) for year in range(years)]

    # Estimate initial revenue based on the latest available data
    initial_revenue = revenue.iloc[0] # assuming the latest data is at index 0

    # Generate years range
    years = list(range(start_year, end_year + 1))

    # Calculate projected revenue, EBIT, net income, and free cash flow
    projected_revenue = calculate_projected_values(initial_revenue, projected_revenue_growth_rate, len(years))
   
    projected_ebit = [r * 0.3 for r in projected_revenue]  # assuming EBIT is 30% of revenue
    projected_net_income = [ebit * 0.7 for ebit in projected_ebit]  # assuming Net Income is 70% of EBIT
    projected_fcf = projected_net_income  # simplified assumption for Free Cash Flow

    # Calculate discount factors and present values of FCF
    discount_factors = [(1 / (1 + wacc)) ** (year + 1) for year in range(len(years))]
    present_values_fcf = [fcf * df for fcf, df in zip(projected_fcf, discount_factors)]

    # Prepare data for CSV
    csv_data = zip(years, projected_revenue, projected_ebit, projected_net_income, projected_fcf, discount_factors, present_values_fcf)

    # Get current working directory
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct the full path to save the file in the 'datasets' directory
    file_path = os.path.join(script_dir, 'datasets', file_name)

    # Write data to CSV
    with open(file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Year', 'Projected Revenue', 'Projected EBIT', 'Projected Net Income', 'Projected Free Cash Flow', 'Discount Factor', 'Present Value of FCF'])
        for row in csv_data:
            writer.writerow(row)

    print(f"CSV file '{file_path}' created with dummy data.")

if __name__ == "__main__":
    # Example usage
    create_dcf_analysis_csv(
        ticker='MSFT', 
        start_year=2024, 
        end_year=2028, 
        projected_revenue_growth_rate=0.05, 
        wacc=0.07,
        file_name='msft_dcf_analysis.csv'
    )
