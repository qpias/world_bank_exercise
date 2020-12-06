import { test } from 'tap';
import 'reflect-metadata';
import { Utils } from '../src/utils';
import { parseRows } from '../src/bank';
const data = require('./data.json');

test('codeToCountry should work with valid codes', t => {
  t.plan(1);
  const country = Utils.codeToCountry("FI");
  t.equal(country.iso, 'FI');
});

test('codeToCountry should fail on invalid codes', t => {
  t.plan(2);
  t.throws(() => {
    Utils.codeToCountry("foo");
  }, new Error("not a valid country: foo"), 'throws assert error');
  t.throws(() => {
    Utils.codeToCountry("");
  }, new Error("not a valid country: "), 'throws assert error');
});

test('calculating should work', t => {
  t.plan(1);
  const countryData = parseRows(data);
  const country = Utils.codeToCountry("BR");
  const avgPopulation = Utils.averageYearlyPopulation(countryData, country, 2000, 2020);
  t.equal(avgPopulation, 194149202);
});

test('calculating change should work', t => {
  t.plan(1);
  const countryData = parseRows(data);
  const country = Utils.codeToCountry("BR");
  const changeGdp = Utils.gdpPerCapitaChange(countryData, country, 1970, 2018);
  t.equal(changeGdp, 8556);
});
