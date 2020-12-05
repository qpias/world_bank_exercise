import fetch from 'node-fetch';
//use typed countries to avoid invalid calls
import type { Country } from 'typed-countries';
import { Utils } from './utils';

export class Bank {

  //returns
  //average yearly population in this millenia per country
  //GDP per capita (USD) change from 1970 to 2018 per country
  static async get(countries: Country[]) {
    const json = await Bank.getData(countries, [Utils.populationIndicator, Utils.gdpIndicator]);
    const now = new Date().getFullYear();
    const countryData = Utils.parseRows(json);
    const ret = countries.map(country => {
      const avgPopulation = Utils.averageYearlyPopulation(countryData, country, 2000, now);
      const gdpPerCapitaChange = Utils.gdpPerCapitaChange(countryData, country, 1970, 2018);
      return { country: country.iso, avgPopulation: avgPopulation, gdpPerCapitaChange: gdpPerCapitaChange };
    });

    return ret;
  }

  //fetches the data from world bank
  private static async getData(countries: Country[], variables: String[]) {
    const countryString = countries.map(country => country.iso).join(";");
    const variableString = variables.join(";");
    //TODO: add date range filter for unneeded years?
    const uri = `http://api.worldbank.org/v2/country/${countryString}/indicator/${variableString}?source=2&format=json&per_page=500`;
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
