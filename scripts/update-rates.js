#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Free Currency APIs alternatives:
// 1. Frankfurter API: https://www.frankfurter.app/docs/ - No key required, limited currencies
// 2. Open Exchange Rates: https://openexchangerates.org - Free tier with API key
// 3. Fixer.io: https://fixer.io - Free tier with API key
// 4. CurrencyFreaks: https://currencyfreaks.com - Free tier with API key
// 5. ExchangeRate-API: https://www.exchangerate-api.com - Free tier with API key

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CURRENCIES = ['USD', 'PEN', 'ARS', 'BRL'];

// Static fallback rates - last updated: 2024-02-17
const FALLBACK_RATES = {
  // Manual updates from xe.com:
  PEN: 3.7,   // Updated: 2024-02-17 - https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=PEN
  ARS: 823.45 // Updated: 2024-02-17 - https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=ARS
};

// Using Frankfurter API (no key required)
const API_URL = 'https://api.frankfurter.app/latest?from=USD&to=BRL';

async function validateResponse(response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  if (!data.rates) {
    throw new Error('Invalid API response format');
  }
  return data;
}

async function updateExchangeRates() {
  try {
    console.log('Fetching latest exchange rates from Frankfurter API...');
    const response = await fetch(API_URL);
    const data = await validateResponse(response);

    // Combine API rates with fallback rates
    const rates = {
      USD: 1,
      ...data.rates,
      ...FALLBACK_RATES
    };

    const currencies = CURRENCIES.map(code => {
      const rate = rates[code];
      if (typeof rate !== 'number') {
        throw new Error(`Missing or invalid rate for currency: ${code}`);
      }
      return {
        code,
        name: getCurrencyName(code),
        rate,
        source: FALLBACK_RATES[code] ? 'static' : 'api',
        lastUpdated: FALLBACK_RATES[code] ? '2024-02-17' : data.date
      };
    });

    const jsonPath = path.resolve(__dirname, '../app/data/currencies.json');
    await fs.writeFile(jsonPath, JSON.stringify({ 
      currencies,
      lastUpdated: data.date,
      staticRatesUpdated: '2024-02-17',
      note: 'Static rates are manually updated. Check FALLBACK_RATES in update-rates.js for latest update timestamps.'
    }, null, 2));

    console.log('Exchange rates updated successfully!');
    console.log('Updated rates:', currencies.map(c => 
      `${c.code}: ${c.rate} (${c.source})`
    ).join(', '));
    console.log('Last updated:', data.date);

  } catch (error) {
    console.error('Error updating exchange rates:', error.message);
    process.exit(1);
  }
}

function getCurrencyName(code) {
  const names = {
    USD: 'US Dollar',
    PEN: 'Peruvian Sol',
    ARS: 'Argentine Peso',
    BRL: 'Brazilian Real'
  };
  const name = names[code];
  if (!name) {
    throw new Error(`Unknown currency code: ${code}`);
  }
  return name;
}

updateExchangeRates();