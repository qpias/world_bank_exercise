import type { Country } from 'typed-countries';
import { Field, ID, ObjectType } from "type-graphql";

//the required indicators
export enum Indicator {
  Population,
  Gdp
}

//data structure for the data rows with just relevant fields
export interface CountryData {
  country: Country,
  year: Number,
  indicator: Indicator,
  value: Number
}

//implementations will parse the data into this typed format
export interface Parser {
  (json: Object): CountryData[];
}

//type-graphql allows us to infer the schema from class structures with these annotations
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
