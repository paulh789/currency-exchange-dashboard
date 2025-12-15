import { getCurrencies } from "@/src/lib/frankfurter";
import RatesDisplay from '@/src/components/RatesDisplay'; 
import CurrencyConverter from '@/src/components/CurrencyConverter';
import { Currency } from "@/src/types/api";

export default async function HomePage() {
  
  // single optimized server call to fetch currency data
  const rates: Currency[] = await getCurrencies(); 
  
  // extract simple list of currency codes and names for selectors
  const simpleCurrencyList = rates.reduce((acc, curr) => {
    acc[curr.code] = curr.name;
    return acc;
  }, {} as { [key: string]: string });

  // pass the data to the client components
  return (
    <main className="container mx-auto p-8">
      
      <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-10 text-center">
        Currency Exchange Dashboard
      </h1>

      {/* currency converter tool */}
      <CurrencyConverter 
        rates={rates}
      />

      {/* exchange rates overview dashboard */}
      <RatesDisplay 
        rates={rates}
        simpleCurrencyList={simpleCurrencyList} 
      /> 

    </main>
  );
}