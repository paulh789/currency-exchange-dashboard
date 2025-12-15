import { useState, useMemo, useRef, useEffect } from 'react';
import { Currency } from '@/src/types/api'; 

interface CustomDropdownProps {
  selectedCode: string;
  setSelectedCode: (code: string) => void;
  currencies: Currency[];
  getFlagPath: (code: string) => string;
}

export default function CustomDropdown({selectedCode, setSelectedCode, currencies, getFlagPath}: CustomDropdownProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  // create a reference to the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null); 

  // find the selected currency data
  const selectedCurrency = useMemo(() => 
    currencies.find(c => c.code === selectedCode), 
    [selectedCode, currencies]
  );

  // handle item selection and close the dropdown
  const handleSelect = (code: string) => {
    setSelectedCode(code);
    setIsOpen(false);
  };

  // hook to handle clicks outside the component
  useEffect(() => {
    // function to check if click is outside the referenced element
    const handleClickOutside = (event: MouseEvent) => {
      // check if the click is not inside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // attach the listener to the document when open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // cleanup: remove the listener when the component unmounts or closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // re-run the effect whenever the 'isOpen' state changes

  return (
    // attach the ref to the main container
    <div className="relative z-30" ref={dropdownRef}> 
      {/* header / selected value display button */}
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCurrency ? (
          <div className="flex items-center">
            {/* selected flag and code */}
            <img
              src={getFlagPath(selectedCurrency.code)}
              alt={`Flag of ${selectedCurrency.code}`}
              className="w-6 h-6 object-cover rounded-full border-gray-400 border mr-3"
            />
            <span className="font-semibold text-lg">{selectedCurrency.code}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select Currency</span>
        )}
        <span className="ml-2 text-gray-500">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* dropdown menu list */}
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-lg shadow-xl bg-white border border-gray-300 max-h-60 overflow-y-auto z-40">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              onClick={() => handleSelect(currency.code)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center justify-between 
                ${currency.code === selectedCode ? 'bg-blue-50 font-medium' : ''}`}
            >
              <div className="flex items-center">
                {/* flag */}
                <img
                  src={getFlagPath(currency.code)}
                  alt={`Flag of ${currency.code}`}
                  className="w-6 h-6 object-cover rounded-full border border-gray-300 mr-3"
                />
                {/* code and name */}
                <span className="font-medium text-gray-900 mr-2">{currency.code}</span>
                <span className="text-sm text-gray-600 truncate">{currency.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}