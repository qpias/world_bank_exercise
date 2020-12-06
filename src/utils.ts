import type { Country } from 'typed-countries';
import { countries } from 'typed-countries';
import { Indicator, CountryData } from './types';

export class Utils {


  //parse country from iso code or fail
  static codeToCountry(code: String): Country {
    const maybeCountry = countries.find(c => c.iso === code);
    if (! maybeCountry) throw new Error('not a valid country: ' + code);
    return maybeCountry;
  }

  static averageYearlyPopulation(countryData: CountryData[], country: Country, fromYear: number, toYear: number) {
    const relevantData = countryData.filter(r => r.country == country && r.year >= fromYear && r.year <= toYear && r.indicator == Indicator.Population);
    const populations = relevantData.map(r => +(r.value));
    const sumPopulations = populations.reduce((a, b) => a + b);
    const averagePopulation = sumPopulations / relevantData.length;
    return Math.round(averagePopulation);
  }

  static gdpPerCapitaChange(countryData: CountryData[], country: Country, fromYear: number, toYear: number) {
    const fromPopulation = countryData.find(r => r.country == country && r.year == fromYear && r.indicator == Indicator.Population)
    const fromGdp = countryData.find(r => r.country == country && r.year == fromYear && r.indicator == Indicator.Gdp)
    if (fromPopulation == undefined || fromGdp == undefined) throw new Error('no such year in the data: ' + fromYear);
    const fromGdpPerCapita = +(fromGdp.value) / +(fromPopulation.value);
    const toGdp = countryData.find(r => r.country == country && r.year == toYear && r.indicator == Indicator.Gdp);
    const toPopulation = countryData.find(r => r.country == country && r.year == toYear && r.indicator == Indicator.Population);
    if (toPopulation == undefined || toGdp == undefined) throw new Error('no such year in the data: ' + toYear);
    const toGdpPerCapita = +(toGdp.value) / +(toPopulation.value);
    const change = toGdpPerCapita - fromGdpPerCapita;
    return Math.round(change);
  }

}
