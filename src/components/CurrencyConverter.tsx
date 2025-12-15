"use client";

import React, { useState, useMemo } from 'react';
import { Currency } from '@/src/types/api';
import CustomDropdown from './CustomDropdown';
import { getFlagPath, formatMaxDecimals } from '@/src/lib/utils';
import { CommissionType } from '@/src/types/commission';
import CommissionInput from './CommissionInput';

interface CurrencyConverterProps {
  // receives the enriched list of currencies (rates vs usd)
  rates: Currency[]; 
}

export default function CurrencyConverter({ rates }: CurrencyConverterProps) {
  // state for input amount string
  const [amountStr, setAmount] = useState<string>("1.0");
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const amount: number = parseFloat(amountStr) || 0;

  // commission states for the innovation feature
  const [commissionType, setCommissionType] = useState<CommissionType>('percentage');
  const [commissionValue, setCommissionValue] = useState<number>(0); 

  // core conversion logic, memoized for performance
  const calculateConversion = useMemo(() => {
    // get cross rate
    const rateFromUSD = rates.find(c => c.code === fromCurrency)?.rate || 1;
    const rateToUSD = rates.find(c => c.code === toCurrency)?.rate || 1;
    const crossRate = rateToUSD / rateFromUSD;

    if (fromCurrency === toCurrency || amount <= 0) {
      return { converted: amount, rate: crossRate, netReceived: amount, cost: 0 };
    }

    // calculate transfer cost based on commission type
    let transferCost = 0;
    
    if (commissionType === 'percentage') {
      transferCost = amount * (commissionValue / 100);
    } else { 
      transferCost = commissionValue;
    }
    
    // ensure cost does not exceed the amount
    transferCost = Math.min(transferCost, amount);

    // calculate the net amount after cost deduction
    const netAmountToConvert = amount - transferCost;
    
    // calculate gross conversion (market rate) and net received amount
    const grossConvertedAmount = amount * crossRate; 
    const netReceivedAmount = netAmountToConvert * crossRate;

    return { 
      converted: grossConvertedAmount,
      rate: crossRate, 
      netReceived: netReceivedAmount,
      cost: transferCost
    };
  }, [amount, fromCurrency, toCurrency, rates, commissionType, commissionValue]);

  const { converted, rate, netReceived, cost } = calculateConversion;
  const convertedStr: string = converted.toString();
  
  // handler to swap from and to currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    // main converter section with mobile padding optimization
    <section className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md max-w-sm sm:max-w-none mx-auto">
      
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8 text-center">Currency Converter</h2>
      
      {/* from and to boxes container, stacks vertically on mobile */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-0 sm:gap-6">

        {/* box 1: from (source) */}
        <ConverterBox 
          title="From"
          currencyCode={fromCurrency}
          setCurrencyCode={setFromCurrency}
          amount={amountStr}
          setAmount={setAmount}
          rates={rates}
          isOutput={false}
        />

        {/* swap button */}
        <div className="flex-shrink-0 my-3 md:mt-[100px] md:my-0"> 
          <button 
            onClick={swapCurrencies}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-lg"
            title="Swap Currencies"
          >
            ⇄
          </button>
        </div>

        {/* box 2: to (destination) */}
        <ConverterBox 
          title="To"
          currencyCode={toCurrency}
          setCurrencyCode={setToCurrency}
          amount={convertedStr}
          setAmount={() => {}} 
          rates={rates}
          isOutput={true}
        />
      </div>

      {/* market rate footer (minimalist context) */}
      <div className="text-center mt-4 sm:mt-6">
        <p className="text-xs sm:text-sm text-gray-500">
          Market Rate: 1 {fromCurrency} = {formatMaxDecimals(rate, 4)} {toCurrency}
        </p>
      </div>

      {/* commission simulation input and result (innovation feature) */}
      <CommissionInput 
        commissionType={commissionType}
        setCommissionType={setCommissionType}
        commissionValue={commissionValue}
        setCommissionValue={setCommissionValue}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        netReceived={netReceived}
        cost={cost}
      />
      
    </section>
  );
}

// auxiliary component: the converter box definition
interface ConverterBoxProps {
  title: string;
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  rates: Currency[];
  isOutput: boolean;
}

const ConverterBox: React.FC<ConverterBoxProps> = ({ 
  title, 
  currencyCode, 
  setCurrencyCode, 
  amount,
  setAmount, 
  rates,
  isOutput
}) => {
  
  const MAX_VALUE = 9999999999;
  const displayAmount = isOutput ? formatMaxDecimals(parseFloat(amount || '0'), 2) : amount;
  
  // input change handler with validation logic
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;

    // handle empty case
    if (inputStr === '') {
      setAmount(''); 
      return; 
    }

    // allow only digits and single period
    let cleanStr = inputStr.replace(/[^0-9.]/g, ''); 

    // enforce canonical format (no leading zeros, max 2 decimals)
    let [integerPart, decimalPart] = cleanStr.split('.');

    // remove unnecessary leading zeros
    if (integerPart.length > 1) {
      integerPart = integerPart.replace(/^0+/, ''); 
      if (integerPart === '') {
        integerPart = '0';
      }
    }
    
    // enforce max 2 decimal places
    if (decimalPart !== undefined) {
      decimalPart = decimalPart.substring(0, 2);
    }

    // reconstruct the string
    let normalizedStr = integerPart;
    
    if (decimalPart !== undefined) {
      normalizedStr += '.' + decimalPart;
    } else if (cleanStr.endsWith('.') && integerPart !== '') {
      normalizedStr += '.';
    }

    // check limits
    const numericValue = parseFloat(normalizedStr);
    
    if (isNaN(numericValue) && normalizedStr !== '0.' && normalizedStr !== '') {
      return; 
    }

    if (numericValue > MAX_VALUE) {
      setAmount(MAX_VALUE.toString());
    } else if (numericValue < 0) {
      setAmount('0');
    } else {
      setAmount(normalizedStr);
    }
  };

  const currentCurrency = useMemo(() => rates.find(c => c.code === currencyCode), [currencyCode, rates]);

  return (
    // box container with mobile width optimization
    <div className="w-full md:w-96 bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-gray-200"> 
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">{title}</h3>

      {/* currency selector dropdown */}
      <CustomDropdown
        selectedCode={currencyCode}
        setSelectedCode={setCurrencyCode}
        currencies={rates}
        getFlagPath={getFlagPath}
      />

      {/* amount input / output field */}
      <div className="mt-3 sm:mt-4">
        <label className="sr-only">Amount</label>
        <input
          type="text"
          value={displayAmount}
          onChange={isOutput ? undefined : handleAmountChange} 
          readOnly={isOutput}
          className={`w-full p-3 sm:p-4 text-2xl sm:text-3xl font-extrabold rounded-lg border-2 
            ${isOutput 
              ? 'text-blue-700 bg-blue-50 border-blue-300' 
              : 'text-gray-900 bg-gray-100 border-gray-300 focus:border-blue-500'
            } 
            transition duration-150 text-right`}
          placeholder="0.00"
        />
      </div>
      
      <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-right">
        {currentCurrency?.name}
      </p>
    </div>
  );
};