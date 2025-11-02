export function expoLocalizationMock() {
  return {
    getLocales: () => [
      {
        languageCode: 'en',
        languageTag: 'en-US',
        regionCode: 'US',
        currencyCode: 'USD',
        currencySymbol: '$',
        decimalSeparator: '.',
        digitGroupingSeparator: ',',
        textDirection: 'ltr',
      },
    ],
    locale: 'en-US',
  };
}
