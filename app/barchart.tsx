//needed for some weird problem using async here...
import 'regenerator-runtime/runtime'
import * as React from 'react';
import * as d3 from 'd3';

interface CustomInputProps {
    measure: string;
}
export default class BarChart extends React.Component<CustomInputProps, { errors: string, countries: string[] }> {

  constructor(props) {
    super(props);
    this.state = {errors: '', countries: ['BR', 'CN', 'FI']};
  }

  async componentDidMount(): Promise<void> {
    const json = await this.getData(this.state.countries);
    this.drawChart(this.createChartData(json));
  }

  //track the inputs
  handleChange = (e) => {
    //inputs are indexed by name
    const countryIndex = +(e.target.name.replace('input', ''));
    const countries = this.state.countries;
    countries[countryIndex] = e.target.value;
    this.setState({
      countries: countries
    });
  }

  drawChart = (data) => {

    d3.select(this.refs.bar).select("svg").remove();
    var svg = d3.select(this.refs.bar)
      .append("svg")
      .attr("width", 500)
      .attr("height", 250);

    var g = svg.selectAll('.someClass')
      .data(data)
      .enter()
      .append("g")
      .attr("class","someClass")
      .attr("transform", (d) => "translate(40," + d.y + ")");

    g.append("rect")
      .attr("width", (d) => d.x)
      .attr("height", 40)
      .style("fill", (d) => d.color);

    g.append("text")
      .style("fill", "black")
      .text((d) => d.text);
  }

  render(){
    return (
      <div>
        <h1>{this.props.measure}</h1>
        <h3>{this.state.errors}</h3>
        <div id={"#bar"} ref={"bar"}>
          <input type="text" name="input0" defaultValue={this.state.countries[0]} onChange={this.handleChange}/>
          <input type="text" name="input1" defaultValue={this.state.countries[1]} onChange={this.handleChange}/>
          <input type="text" name="input2" defaultValue={this.state.countries[2]} onChange={this.handleChange}/>
          <button onClick={this.redraw}>update countries</button>
          <br/>
        </div>
      </div>);
  }

  createChartData = (json) => {
    const measure = this.props.measure;
    const maxValue = Math.max(...json.map(r => r[measure]));
    const multiplier = 500 / maxValue;
    const data = [{
        x: multiplier * json[0][measure],
        y: 30,
        color: "red",
        text: json[0].country + ': ' + json[0][measure]
      }, {
        x: multiplier * json[1][measure],
        y: 100,
        color: "blue",
        text: json[1].country + ': ' + json[1][measure]
      }, {
        x: multiplier * json[2][measure],
        y: 170,
        color: "green",
        text: json[2].country + ': ' + json[2][measure]
      }];
    return data;
  }

  //TODO: this method should really be passed to the component, or something...
  getData = async (countries: string[]) => {
    this.setState({
      errors: ''
    });
    //support lowercase codes in the inputs too
    const countryString = JSON.stringify(countries.map(s => s.toUpperCase()));
    //let's not make this too fancy...
    const uri = 'http://localhost:7000';
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: '{ measures(countries:' + countryString + ')	{country ' + this.props.measure + '}	}'})
    });

    //TODO: the error handling here is just a quick hack...
    if (! response.ok) {
      const errorJson = await response.json();
      this.setState({
        errors: errorJson.error
      });
    }

    const json = await response.json();
    if (json.errors != undefined) {
      this.setState({
        errors: json.errors[0].message
      });
    }
    console.log(json)
    return json.data.measures;
  }

  redraw = async () => {
    try {
      const json = await this.getData(this.state.countries);
      this.drawChart(this.createChartData(json));
    }
    catch(e) {
      console.log('awesome error handling: ' + e);
    }
  }
}
