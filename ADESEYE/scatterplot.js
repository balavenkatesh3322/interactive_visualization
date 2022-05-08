export const scatterPlot = (selection, props) =>{
    const {
        xValue,
        yValue,
        xAxisLabel,
        yAxisLabel,
        circleRadius,
        margin,
        width,
        height,
        data
    } = props
// Zooming
    selection.call(d3.zoom().on('zoom', ()=>{
        g.attr('transform', d3.event.transform);
      }))
  
    const innerwidth = width - margin.left - margin.right
    const innerheight = height - margin.top - margin.bottom
  
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerwidth])
      .nice()
    
  
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue)) 
      .range([innerheight, 0]) 
      .nice()
  
    const g = selection.selectAll('.container').data([null])
    const gEnter = g
        .enter().append('g')
            .attr('class', 'container')
    gEnter
        .merge(g)
            .attr('transform', 
                `translate(${margin.left}, ${margin.top})`) 
    const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerwidth)
    .tickPadding(12)
    
    const yAxisG = g.select('.y-axis')
    const yAxisGEnter = gEnter
        .append('g')
            .attr('class', 'y-axis')
    yAxisG
        .merge(yAxisGEnter)
            .call(yAxis)
            .selectAll('.domain').remove();
    const yAxisLabelText = yAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
            .attr('y', -70)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
        .merge(yAxisG.select('.axis-label'))
            .attr('x', -innerheight / 2)
            .text(yAxisLabel)
  
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerheight)
      .tickPadding(14)
      
    const xAxisG = g.select('.x-axis')
    const xAxisGEnter = gEnter
        .append('g')
            .attr('class', 'x-axis')
    xAxisG
        .merge(xAxisGEnter)
        .attr('transform', `translate(0, ${innerheight})`)
            .call(xAxis)
            .selectAll('.domain').remove();

    const xAxisLabelText = xAxisGEnter
    .append('text')
        .attr('class', 'axis-label')
        .attr('y', 60)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    .merge(xAxisG.select('.axis-label'))
        .attr('x', innerheight / 2)
        .text(xAxisLabel)
  

    const circles = g.merge(gEnter)
        .selectAll('circle').data(data)
    circles
        .enter().append('circle')
            .attr('cx', innerwidth / 2)
            .attr('cy', innerheight / 2)
        .merge(circles)
        .transition().duration(2000)
        .delay((d, i) => i * 10)
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('r', circleRadius) 
}