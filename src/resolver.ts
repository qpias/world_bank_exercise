import { Utils } from './utils';
import { CountryMeasures, Indicator } from './types';
import { Bank, parseRows } from './bank';
import { Resolver, Query, Arg } from "type-graphql";

@Resolver(CountryMeasures)
class CountryMeasuresResolver {

  @Query(returns => [CountryMeasures])
  async measures(@Arg("countries", type => [String]) countryCodes: string[]) {
    const countries = countryCodes.map(Utils.codeToCountry);
    const json = await Bank.getData(countries, [Indicator.Population, Indicator.Gdp]);
    const now = new Date().getFullYear();
    const countryData = parseRows(json);
    const ret = countries.map(country => {
      const avgPopulation = Utils.averageYearlyPopulation(countryData, country, 2000, now);
      const gdpPerCapitaChange = Utils.gdpPerCapitaChange(countryData, country, 1970, 2018);
      return new CountryMeasures(country.iso, gdpPerCapitaChange, avgPopulation);
    });
    return ret;
  }

}

export const resolvers = [CountryMeasuresResolver] as const;
