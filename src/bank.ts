import fetch from 'node-fetch';
//use typed countries to avoid invalid calls
import type { Country } from 'typed-countries';
import { Utils } from './utils';
import { Indicator, CountryData, Parser } from './types';

export class Bank {


    private static populationIndicator = 'SP.POP.TOTL';
    private static gdpIndicator = 'NY.GDP.MKTP.CD';
    static indicatorMappings: Map<String, Indicator> = new Map([
          [Bank.populationIndicator, Indicator.Population],
          [Bank.gdpIndicator, Indicator.Gdp]
      ]);



  //fetches the data from world bank
  static async getData(countries: Country[], indicators: Indicator[]) {
    //verify the indicators are supported
    indicators.forEach(indicator => {
      const supportedIndicators = [ ...Bank.indicatorMappings.values() ];
      if (! supportedIndicators.includes(indicator)) throw new Error('unsupported indicator: ' + indicator);
    });
    //get keys for the indicators
    const indicatorKeys = [ ...Bank.indicatorMappings.keys() ].filter(k => {
      const indicator = Bank.indicatorMappings.get(k);
      return indicator != undefined && indicators.includes(indicator);
    });
    const countryString = countries.map(country => country.iso).join(";");
    const indicatorString = indicatorKeys.join(";");
    //TODO: add date range filter?
    const uri = `http://api.worldbank.org/v2/country/${countryString}/indicator/${indicatorString}?source=2&format=json&per_page=500`;
    try {
      const response = await fetch(uri);
      if (! response.ok) throw new Error('failed to connect to world bank api (' + uri + '): ' + response.statusText)
  	  const json = await response.json();
      return json;
    } catch(e) {
      throw new Error('something happened: ' + e);
    }
  }

}

//implements Parser for world bank data
//TODO: can we do this without "let"?
let parseRows: Parser
parseRows = function (json: Object): CountryData[] {
  //why does the type system not catch null values here???
  return json[1].filter(r => r.value != null).map(r => {
    const indicator = Bank.indicatorMappings.get(r.indicator.id);
    if (indicator == undefined) throw new Error('unknown indicator: ' + r.indicator.id);
    const cd: CountryData = {
      country: Utils.codeToCountry(r.country.id),
      year: r.date,
      indicator: indicator,
      value: r.value
    };
    return cd;
  });
};

export { parseRows };
