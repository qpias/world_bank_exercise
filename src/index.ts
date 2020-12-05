// Using Promises without this module might cause file descriptor and memory leaks: https://github.com/mcollina/make-promises-safe
import 'make-promises-safe';
import { Bank } from './bank';
import { Utils } from './utils';

//export default () => 'put your code here'
import express from 'express';
const app = express();
const PORT = 8000;


app.get('/', async (req, res, next) => {
  const query = req.query.countries;
  try {
    //validate the query
    if (query == undefined || query == '') throw new Error('missing param "countries"');
    const countries = query.split(";").map(Utils.codeToCountry);
    const json = await Bank.get(countries);
    res.send(json);
  }
  catch(e) {
    next(e);
  }
});
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
