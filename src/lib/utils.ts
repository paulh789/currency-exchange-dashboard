// maps currency code to the flag file name convention
export function getFlagPath(code: string): string {
  const countryMap: { [key: string]: string } = {
    "USD": "United_States", "EUR": "European_Union", "JPY": "Japan", 
    "GBP": "United_Kingdom", "AUD": "Australia", "CAD": "Canada",
    "CHF": "Switzerland", "CNY": "China", "SGD": "Singapore", 
    "NZD": "New_Zealand", "MXN": "Mexico", "BRL": "Brazil", 
    "INR": "India",
  };
  const countryName = countryMap[code] || 'Placeholder'; 
  return `/flags/Flag_of_${countryName}.svg`;
}

// formats a number to a max number of decimals, removing trailing zeros
export function formatMaxDecimals(number: number, maxDecimals: number): string {
  const fixedString = number.toFixed(maxDecimals);
  return parseFloat(fixedString).toString();
}