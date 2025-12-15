import { CurrencyNames, LatestRatesResponse, Currency } from "@/src/types/api";

const BASE_URL = "https://api.frankfurter.app";

// list of key currencies for the server call
export const KEY_CURRENCIES = [
  "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", 
  "CNY", "SGD", "NZD", "MXN", "BRL", "INR" 
];

// manual mapping of entity/country
const ENTITY_MAP: { [key: string]: string } = {
  "USD": "United States", "EUR": "European Union", "JPY": "Japan", 
  "GBP": "United Kingdom", "AUD": "Australia", "CAD": "Canada",
  "CHF": "Switzerland", "CNY": "China", "SGD": "Singapore", 
  "NZD": "New Zealand", "MXN": "Mexico", "BRL": "Brazil", 
  "INR": "India",
};

// function to fetch all available currency names
export async function getCurrencyNames(): Promise<CurrencyNames> {
  const response = await fetch(`${BASE_URL}/currencies`, {
    next: { revalidate: 3600 } // revalidates every hour
  });

  if (!response.ok) {
    throw new Error('Error fetching currency list');
  }

  // return the currency list
  return response.json();
}

// core function: fetches and enriches the key currency data
export async function getCurrencies(): Promise<Currency[]> {
    
  // construct the url for the key currencies with usd as base
  const url = `${BASE_URL}/latest?from=USD&to=${KEY_CURRENCIES.slice(1).join(',')}`;
  
  // fetch rates and full names concurrently
  const [ratesResponse, currencyNames] = await Promise.all([
    // promise 1: get exchange rates (revalidates hourly)
    fetch(url, { next: { revalidate: 3600 } }), 
    // promise 2: get full currency names
    getCurrencyNames()
  ]);
  
  if (!ratesResponse.ok) {
    throw new Error('Error fetching key exchange rates');
  }

  const ratesData: LatestRatesResponse = await ratesResponse.json();
  
  // process rates data, manually adding the base (usd: 1.0)
  const currencyRates = { [ratesData.base]: ratesData.amount, ...ratesData.rates }; 

  // map and create the currency array
  const currenciesData: Currency[] = KEY_CURRENCIES.map(code => {
    return {
      code: code,
      name: currencyNames[code],
      entity: ENTITY_MAP[code],
      rate: currencyRates[code],
    };
  });

  return currenciesData;
}