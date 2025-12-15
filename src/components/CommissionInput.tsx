"use client";

import React from 'react';
import { CommissionType } from '@/src/types/commission';
import { formatMaxDecimals } from '@/src/lib/utils';

interface CommissionInputProps {
  commissionType: CommissionType;
  setCommissionType: (type: CommissionType) => void;
  commissionValue: number;
  setCommissionValue: (value: number) => void;
  fromCurrency: string;
  toCurrency: string;
  netReceived: number; // net amount received by recipient
  cost: number; // cost deducted in the source currency
}

export default function CommissionInput(
  {
    commissionType, 
    setCommissionType, 
    commissionValue, 
    setCommissionValue, 
    fromCurrency, 
    toCurrency, 
    netReceived, 
    cost
  }: CommissionInputProps) {
  
  // max value for percentage is 100, max value for fixed fee is larger
  const MAX_INPUT_VALUE = commissionType === 'percentage' ? 100 : 999999; 
  
  // handles input change and applies basic validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value.replace(/[^0-9.]/g, ''); 
    const numericValue = parseFloat(inputStr);

    if (inputStr === '') {
      setCommissionValue(0);
      return;
    }

    if (isNaN(numericValue) || numericValue < 0) {
      setCommissionValue(0);
      return;
    }

    // limit the value based on the type
    const finalValue = Math.min(numericValue, MAX_INPUT_VALUE);
    
    // simple 2 decimal place restriction
    setCommissionValue(parseFloat(finalValue.toFixed(2))); 
  };

  return (
    // container for commission simulation feature
    <div className="mt-3 px-0 sm:px-4 py-3 border-t border-gray-300 w-full">
      <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">Simulate Transfer Cost</h3>
      
      {/* input and result container, centered on the page */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4"> 
        
        {/* a. input group (selector + value input) */}
        <div className="flex items-center gap-2 flex-shrink-0"> 
          
          {/* 1. fee type select */}
          <select
            value={commissionType}
            onChange={(e) => setCommissionType(e.target.value as CommissionType)}
            className="p-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white h-full"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Fee</option>
          </select>

          {/* input group container */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            {/* 2. value input field */}
            <input
              type="text"
              value={commissionValue === 0 ? '' : commissionValue.toString()}
              onChange={handleValueChange}
              className="p-1.5 text-sm text-right w-16 sm:w-20 rounded-l-lg focus:outline-none"
              placeholder="0"
            />
            {/* unit display (%) or currency code */}
            <span className="p-2 text-xs text-gray-500 bg-gray-100 rounded-r-lg">
              {commissionType === 'percentage' ? '%' : fromCurrency}
            </span>
          </div>
        </div>

        {/* b. minimalist result display */}
        <div className="text-center sm:text-left flex-shrink-0 border-t border-gray-200 sm:border-none pt-2 sm:pt-0 w-full sm:w-auto">
          
          <p className="text-sm font-bold text-gray-700 whitespace-nowrap">
            Net Received: <span className="text-lg font-extrabold text-blue-700 ml-1">
              {formatMaxDecimals(netReceived, 2)} {toCurrency}
            </span>
          </p>
          
          <p className="text-xs text-red-600">
            Cost: {formatMaxDecimals(cost, 2)} {fromCurrency}
          </p>
        </div>
        
      </div>
    </div>
  );
}