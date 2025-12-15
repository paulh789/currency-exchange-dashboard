// Define the exchange rates object.
// 'string' is the key (e.g. "USD") and 'number' is the value (e.g. 1.0)
export type CurrencyRates = {
  [key: string]: number;
};

// Define the available currency names object.
// 'string' is the code (e.g. "USD") and 'string' is the full name (e.g. "US Dollar")
export type CurrencyNames = {
  [key: string]: string;
};

// Define the structure of the full response from the /latest endpoint
export interface LatestRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: CurrencyRates;
}

// Data structure for each currency
export interface Currency {
  code: string;
  name: string;
  entity: string;
  rate: number;
}