import type { Country } from 'typed-countries';

export enum Indicator {
  Population,
  Gdp
}

export interface CountryData {
  country: Country,
  year: Number,
  indicator: Indicator,
  value: Number
}

export interface Parser {
  (json: Object): CountryData[];
}
