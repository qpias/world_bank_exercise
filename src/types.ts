import type { Country } from 'typed-countries';
import { Field, ID, ObjectType } from "type-graphql";

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

@ObjectType()
export class CountryMeasures {

  constructor(country: string, gdpPerCapitaChange: number, avgPopulation: number) {
    this.country = country;
    this.gdpPerCapitaChange = gdpPerCapitaChange;
    this.avgPopulation = avgPopulation;
  }

  @Field(type => ID)
  country: string;

  @Field()
  gdpPerCapitaChange: number

  @Field()
  avgPopulation: number
}
