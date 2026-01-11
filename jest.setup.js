jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en', countryCode: 'US' }],
  getNumberFormatSettings: () => ({ decimalSeparator: '.', groupingSeparator: ',' }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'America/New_York',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
