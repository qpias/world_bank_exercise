import type { Country } from 'typed-countries';
import { countries } from 'typed-countries';

export class Utils {
  static populationIndicator = 'SP.POP.TOTL';
  static gdpIndicator = 'NY.GDP.MKTP.CD';

  //parse country from iso code or fail
  static codeToCountry(code: String): Country {
    const maybeCountry = countries.find(c => c.iso === code);
    if (! maybeCountry) throw new Error("not a valid country: " + code);
    return maybeCountry;
  }

  static parseRows(json: Object): CountryData[] {
    //why does the type system not catch null values here???
    return json[1].filter(r => r.value != null).map(r => {
      const cd: CountryData = {
        country: Utils.codeToCountry(r.country.id),
        year: r.date,
        indicator: r.indicator.id,
        value: r.value
      };
      return cd;
    });
  }

  static averageYearlyPopulation(countryData: CountryData[], country: Country, fromYear: number, toYear: number) {
    const relevantData = countryData.filter(r => r.country == country && r.year >= fromYear && r.year <= toYear && r.indicator == Utils.populationIndicator);
    const populations = relevantData.map(r => +(r.value));
    const sumPopulations = populations.reduce((a, b) => a + b);
    const averagePopulation = sumPopulations / relevantData.length;
    return Math.round(averagePopulation);
  }

  static gdpPerCapitaChange(countryData: CountryData[], country: Country, fromYear: number, toYear: number) {
    const fromPopulation = countryData.find(r => r.country == country && r.year == fromYear && r.indicator == Utils.populationIndicator)
    const fromGdp = countryData.find(r => r.country == country && r.year == fromYear && r.indicator == Utils.gdpIndicator)
    if (fromPopulation == undefined || fromGdp == undefined) throw new Error('no such year in the data: ' + fromYear);
    const fromGdpPerCapita = +(fromGdp.value) / +(fromPopulation.value);
    const toGdp = countryData.find(r => r.country == country && r.year == toYear && r.indicator == Utils.gdpIndicator);
    const toPopulation = countryData.find(r => r.country == country && r.year == toYear && r.indicator == Utils.populationIndicator);
    if (toPopulation == undefined || toGdp == undefined) throw new Error('no such year in the data: ' + toYear);
    const toGdpPerCapita = +(toGdp.value) / +(toPopulation.value);
    const change = toGdpPerCapita - fromGdpPerCapita;
    return Math.round(change);
  }

}

interface CountryData {
  country: Country,
  year: Number,
  indicator: String,
  value: Number
}
