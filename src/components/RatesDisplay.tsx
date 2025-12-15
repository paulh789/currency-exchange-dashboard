"use client";

import { useState, useMemo } from 'react';
import { Currency } from '@/src/types/api';
import CustomDropdown from './CustomDropdown'; 
import { getFlagPath, formatMaxDecimals } from '@/src/lib/utils';

interface RatesDisplayProps {
  // list of currencies received from the server
  rates: Currency[]; 
  // simple list of currency names for selection
  simpleCurrencyList: { [key: string]: string }; 
}

export default function RatesDisplay({ rates, simpleCurrencyList }: RatesDisplayProps) {
  
  // state for the currently selected base currency
  const [baseCurrency, setBaseCurrency] = useState<string>('USD'); 
  
  // list of all currency objects available for selection
  const currencyOptions = rates;

  // core logic: calculate cross rates locally using the rule of three
  const calculatedRates = useMemo(() => {
    // find the rate of the selected base currency relative to the api base (usd)
    const baseRateToUSD = rates.find(c => c.code === baseCurrency)?.rate || 1;
    
    // iterate over rates and recalculate against the new base
    const ratesDisplay = rates.map(currency => {
      // rate x to base = (rate x to usd) / (rate base to usd)
      const newRate = currency.rate / baseRateToUSD; 

      return {
        ...currency, 
        rate: newRate, 
      };
    }).filter(c => c.code !== baseCurrency); // remove the base currency from the list

    return ratesDisplay;
    
  }, [baseCurrency, rates]); // recalculates when baseCurrency changes

  // get the name of the base currency for display
  const baseCurrencyName = simpleCurrencyList[baseCurrency] || baseCurrency;

  return (
    // main display section
    <section className="bg-gray-50 p-6 rounded-lg shadow-md mb-8 mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8 text-center">Exchange Rates Overview</h2>

      {/* selector of base currency using custom dropdown */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-4 w-full justify-center">
        <label className="text-gray-700 font-bold text-lg whitespace-nowrap">Base Currency:</label>
        <div className="w-full md:w-70"> 
          <CustomDropdown
            selectedCode={baseCurrency}
            setSelectedCode={setBaseCurrency}
            currencies={currencyOptions}
            getFlagPath={getFlagPath}
          />
        </div>
      </div>

      {/* rates dashboard grid */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          1 {baseCurrencyName} ({baseCurrency}) equals:
        </p>
          
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* map through the calculated rates to display the boxes */}
          {calculatedRates.slice(0, 12).map((currency) => (
            <div 
              key={currency.code} 
              className="bg-white border border-blue-300 rounded-lg p-3 text-center transition duration-150 hover:shadow-md"
            >
              {/* flag and code section */}
              <div className="flex justify-between items-center mb-2">
                {/* flag (top left) */}
                <img
                  src={getFlagPath(currency.code)}
                  alt={`Flag of ${currency.code}`}
                  className="w-8 h-8 object-cover rounded-full border border-gray-300"
                />
                {/* code (top right) */}
                <span className="text-sm font-medium text-gray-600">
                  {currency.code}
                </span>
              </div>

              {/* rate value (centered and bold) */}
              <p className="text-2xl font-extrabold text-gray-900 mt-1">
                {formatMaxDecimals(currency.rate, 2)}
              </p>
              
              {/* currency name */}
              <p className="text-xs text-gray-500 truncate mt-1">
                {currency.name} 
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}