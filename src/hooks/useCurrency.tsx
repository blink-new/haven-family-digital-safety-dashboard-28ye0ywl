import { useState, useEffect } from 'react'

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  rate: number // Exchange rate from USD
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  // North America
  'US': { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.00 },
  'CA': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  'MX': { code: 'MXN', symbol: '$', name: 'Mexican Peso', rate: 17.50 },
  
  // Europe
  'GB': { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  'DE': { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  'FR': { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  'IT': { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  'ES': { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  'NL': { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  'CH': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.88 },
  'SE': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 10.50 },
  'NO': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 10.80 },
  'DK': { code: 'DKK', symbol: 'kr', name: 'Danish Krone', rate: 6.85 },
  
  // Asia Pacific
  'AU': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  'NZ': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.65 },
  'JP': { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.00 },
  'KR': { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1320.00 },
  'SG': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35 },
  'HK': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rate: 7.80 },
  'IN': { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.00 },
  'CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.25 },
  
  // Other regions
  'BR': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.00 },
  'AR': { code: 'ARS', symbol: '$', name: 'Argentine Peso', rate: 350.00 },
  'ZA': { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.50 },
  'IL': { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', rate: 3.70 },
  'AE': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  'SA': { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', rate: 3.75 },
}

const DEFAULT_CURRENCY: CurrencyInfo = CURRENCY_MAP['US']

export const useCurrency = () => {
  const [currency, setCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<string>('')

  // Get user's location and set currency
  useEffect(() => {
    const detectLocationByIP = async () => {
      try {
        // Fallback: Use IP-based location detection
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const countryCode = data.country_code
        
        if (countryCode && CURRENCY_MAP[countryCode]) {
          setCurrency(CURRENCY_MAP[countryCode])
          setUserLocation(data.country_name || countryCode)
        }
      } catch (error) {
        console.warn('IP-based location detection failed:', error)
        // Keep default USD currency
      }
    }

    const detectLocation = async () => {
      try {
        // Try to get location from browser geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use reverse geocoding to get country code
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                )
                const data = await response.json()
                const countryCode = data.countryCode
                
                if (countryCode && CURRENCY_MAP[countryCode]) {
                  setCurrency(CURRENCY_MAP[countryCode])
                  setUserLocation(data.countryName || countryCode)
                }
              } catch (error) {
                console.warn('Failed to get location from coordinates:', error)
                // Fallback to IP-based detection
                await detectLocationByIP()
              }
              setIsLoading(false)
            },
            async () => {
              // User denied geolocation, fallback to IP-based detection
              await detectLocationByIP()
              setIsLoading(false)
            }
          )
        } else {
          // Geolocation not supported, fallback to IP-based detection
          await detectLocationByIP()
          setIsLoading(false)
        }
      } catch (error) {
        console.warn('Location detection failed:', error)
        setIsLoading(false)
      }
    }

    detectLocation()
  }, [])

  // Format price based on current currency
  const formatPrice = (usdAmount: number, options?: {
    showCurrency?: boolean
    decimals?: number
  }) => {
    const { showCurrency = true, decimals = 2 } = options || {}
    const convertedAmount = usdAmount * currency.rate
    
    // Handle currencies with no decimal places (like JPY, KRW)
    const finalDecimals = ['JPY', 'KRW'].includes(currency.code) ? 0 : decimals
    
    const formatted = convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals
    })
    
    if (showCurrency) {
      return `${currency.symbol}${formatted}`
    }
    
    return formatted
  }

  // Convert USD amount to current currency
  const convertFromUSD = (usdAmount: number): number => {
    return usdAmount * currency.rate
  }

  // Get currency info for a specific country
  const getCurrencyForCountry = (countryCode: string): CurrencyInfo => {
    return CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY
  }

  // Manually set currency (for user preference override)
  const setCurrencyByCode = (currencyCode: string) => {
    const foundCurrency = Object.values(CURRENCY_MAP).find(c => c.code === currencyCode)
    if (foundCurrency) {
      setCurrency(foundCurrency)
    }
  }

  return {
    currency,
    isLoading,
    userLocation,
    formatPrice,
    convertFromUSD,
    getCurrencyForCountry,
    setCurrencyByCode,
    availableCurrencies: Object.values(CURRENCY_MAP),
    supportedCountries: Object.keys(CURRENCY_MAP)
  }
}