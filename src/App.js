import React, { useCallback, useEffect, useMemo } from 'react'
import * as d3 from 'd3'

const generateRandomValues = (minValue, maxValue) => {
  return Math.floor(Math.random() * (maxValue - minValue) + 1) + minValue
}

const generateDataPoints = () => {
  const dataPoints = []
  const numberOfDataPoints = 10

  for (let x = 0; x < numberOfDataPoints; x++) {
    const x = generateRandomValues(1800, 2022)
    const y = generateRandomValues(1, 1000)
    dataPoints.push({ x, y })
  }

  return dataPoints
}

const App = () => {
  const margins = useMemo(
    () => ({ top: 20, right: 20, bottom: 20, left: 40 }),
    []
  )
  const dataVizWidth = 500 - margins.left - margins.right
  const dataVizHeight = 500 - margins.top - margins.bottom

  const draw = useCallback(
    (_dataPoints) => {
      const dataPoints = _dataPoints.sort((x, y) => d3.ascending(x.x, y.x))
      const xValues = dataPoints.map((d) => d.x)
      const yMinMax = d3.extent(dataPoints, (d) => d.y)

      const xScale = d3
        .scaleBand()
        .domain([...xValues])
        .range([0, dataVizWidth])

      const yScale = d3
        .scaleLinear()
        .domain([yMinMax[0], yMinMax[1]])
        .range([dataVizHeight, 0])

      const axisBottom = d3.axisBottom(xScale)
      const axisLeft = d3.axisLeft(yScale)

      const xAxis = d3
        .select('.xScale')
        .attr(
          'transform',
          `translate(${margins.left}, ${dataVizHeight + margins.top})`
        )

      const yAxis = d3
        .select('.yScale')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)

      xAxis.transition().call(axisBottom)
      yAxis.transition().call(axisLeft)

      const dataPointsContainer = d3
        .select('.dataPoints')
        .datum(dataPoints)
        .join('path')

      dataPointsContainer
        .transition()
        .duration(1500)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
        )
    },
    [margins, dataVizHeight, dataVizWidth]
  )

  const handleClick = () => {
    const dataPoints = generateDataPoints()
    draw(dataPoints)
  }

  useEffect(() => {
    d3.select('.container').append('svg').attr('width', 500).attr('height', 500)
    const svg = d3.select('svg')

    svg.append('g').classed('xScale', true)
    svg.append('g').classed('yScale', true)
    svg
      .append('path')
      .classed('dataPoints', true)
      .attr('transform', `translate(${margins.left}, ${margins.top})`)

    const dataPoints = generateDataPoints()
    draw(dataPoints)
  }, [draw, margins])

  return (
    <>
      <div className='container'></div>
      <button onClick={handleClick}>Update Data</button>
    </>
  )
}

export default App
