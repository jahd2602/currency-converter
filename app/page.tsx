"use client";

import { useState } from "react";
import Image from "next/image";
import currencyData from './data/currencies.json';

interface Currency {
  code: string;
  name: string;
  rate: number;
}

const currencies: Currency[] = currencyData.currencies;

export default function Home() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(currencies.map(c => [c.code, ""]))
  );

  const handleInputChange = (currencyCode: string, value: string) => {
    const numValue = value === "" ? "" : parseFloat(value);
    const newValues: Record<string, string> = {};
    
    if (numValue !== "") {
      const sourceCurrency = currencies.find(c => c.code === currencyCode)!;
      currencies.forEach(targetCurrency => {
        const converted = (numValue / sourceCurrency.rate) * targetCurrency.rate;
        newValues[targetCurrency.code] = converted.toFixed(2);
      });
    } else {
      currencies.forEach(c => {
        newValues[c.code] = "";
      });
    }

    setValues(newValues);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-2xl font-bold">Currency Converter</h1>
        <div className="flex flex-col items-center space-y-4">
          {currencies.map((currency) => (
            <div key={currency.code} className="flex items-center space-x-2">
              <span title={currency.name}>{currency.code}</span>
              <input
                type="number"
                value={values[currency.code]}
                onChange={(e) => handleInputChange(currency.code, e.target.value)}
                placeholder={`Enter ${currency.code}`}
                className="border p-2 rounded w-32"
              />
            </div>
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
