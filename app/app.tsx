import * as ReactDOM from 'react-dom';
import * as React from 'react';
import BarChart from './barchart';

ReactDOM.render(<div><BarChart measure={"avgPopulation"}/><BarChart measure={"gdpPerCapitaChange"}/></div>, document.body);
