// Using Promises without this module might cause file descriptor and memory leaks: https://github.com/mcollina/make-promises-safe
import 'make-promises-safe';
import { Controller } from './controller';

import express from 'express';
const app = express();
const PORT = 8000;

app.use('/', express.static('dist'));

app.get('/api', async (req, res, next) => {
  const query = req.query.countries;
  try {
    //validate the query
    if (query == undefined || query == '') throw new Error('missing param "countries"');
    const countryCodes = query.split(";");
    const json = await Controller.getValues(countryCodes);
    res.send(json);
  }
  catch(e) {
    next(e);
  }
});
app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send({error : err.message});
});
