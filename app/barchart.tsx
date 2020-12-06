//needed for some weird problem using async here...
import 'regenerator-runtime/runtime'
import * as React from 'react';
import * as d3 from 'd3';

//Do we really need this to use props on custom classes?
interface CustomInputProps {
    measure: string;
}
export default class BarChart extends React.Component<CustomInputProps, { errors: string }> {
  private input1: React.RefObject<HTMLInputElement>;
  private input2: React.RefObject<HTMLInputElement>;
  private input3: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.state = {errors: ''};
    this.input1 = React.createRef();
    this.input2 = React.createRef();
    this.input3 = React.createRef();
  }

  async componentDidMount(): Promise<void> {
    const json = await this.getData(['BR', 'CN', 'FI']);
    this.drawChart(this.createChartData(json));
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
          <input type="text" ref={this.input2} defaultValue={"FI"}/>
          <input type="text" ref={this.input1} defaultValue={"BR"}/>
          <input type="text" ref={this.input3} defaultValue={"CN"}/>
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

  getData = async (countries: string[]) => {
    this.setState({
      errors: ''
    });
    const countryString = JSON.stringify(countries);
    const uri = 'http://localhost:7000';
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: '{ measures(countries:' + countryString + ')	{country ' + this.props.measure + '}	}'})
    });

    if (! response.ok) {
      const errorJson = await response.json();
      this.setState({
        errors: errorJson.error
      });
    }

    const json = await response.json();
    return json.data.measures;
  }

  redraw = async () => {
    const input1 = this.input1.current ? this.input1.current.value : '';
    const input2 = this.input2.current ? this.input2.current.value : '';
    const input3 = this.input3.current ? this.input3.current.value : '';
    const json = await this.getData([input1, input2, input3]);
    this.drawChart(this.createChartData(json));
  }
}
