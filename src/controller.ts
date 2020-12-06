import { Utils } from './utils';
import { Bank, parseRows } from './bank';
import { Indicator } from './types';

export class Controller {
  //returns
  //average yearly population in this millenia per country
  //GDP per capita (USD) change from 1970 to 2018 per country
  static async getValues(countryCodes: String[]) {
    const countries = countryCodes.map(Utils.codeToCountry);
    const json = await Bank.getData(countries, [Indicator.Population, Indicator.Gdp]);
    const now = new Date().getFullYear();
    const countryData = parseRows(json);
    const ret = countries.map(country => {
      const avgPopulation = Utils.averageYearlyPopulation(countryData, country, 2000, now);
      const gdpPerCapitaChange = Utils.gdpPerCapitaChange(countryData, country, 1970, 2018);
      return { country: country.iso, avgPopulation: avgPopulation, gdpPerCapitaChange: gdpPerCapitaChange };
    });

    return ret;
  }
}
