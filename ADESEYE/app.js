import { dropdownMenu } from "./dropdownMenu.js"
import { scatterPlot } from "./scatterplot.js"

const csv = d3.csv('top_20_CA_wildfires.csv')
const svg = d3.select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

let data;
let xColumn;
let yColumn;

const onXColumnClicked =  column => {
  xColumn = column;
  render()
}
const onYColumnClicked =  column => {
  yColumn = column;
  render()
}

const render = () =>{

  d3.select('#x-menu')
  .call(dropdownMenu,{
  options: data.columns,
  onOptionClicked:onXColumnClicked,
  selectedOption: xColumn
})
  d3.select('#y-menu')
  .call(dropdownMenu,{
  options: data.columns,
  onOptionClicked:onYColumnClicked,
  selectedOption: yColumn
})
  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    yValue: d => d[yColumn],
    xAxisLabel: xColumn,
    circleRadius: 10,
    yAxisLabel: yColumn,
    margin: { top: 10, left:120,right:250, bottom:70},
    width,
    height,
    data
  
  })
}

csv.then(loadedData =>{
  data = loadedData
  console.log(loadedData);
  data.forEach(d => {
    d.acres = +d.acres
    d.structures = +d.structures
    d.death = +d.death
    d.year = +d.year
  });
  xColumn = data.columns[4]
  yColumn = data.columns[0]
  render()
})