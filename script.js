const margin = {top:50, left:100, bottom:80, right:50};
const width = 700-margin.left- margin.right;
const height = 600-margin.top- margin.bottom;

let svg = d3.select('.chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('driving.csv', d3.autoType).then(data=>{ 

const xAxis = d3.scaleLinear()
    .range([0,width])
    .domain(d3.extent(data, d=>d.miles)).nice()

const Maxis = d3.axisBottom()
    .ticks(7, 's')
    .scale(xAxis)
    .tickFormat(function(d) {
        return d3.format(',')(d)
    })

let X = svg.append('g')
    .attr('class', 'axis x-axis')
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(Maxis);

X.select('.domain').remove()


const yAxis = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, d=>d.gas)).nice()
 
const Gaxis = d3.axisLeft()
    .ticks(9, 's')
    .scale(yAxis)
    .tickFormat(function(d) {
        return '$' + d3.format('.2f')(d)
    })

let Y = svg.append('g')
    .attr('class', 'axis y-axis')
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(Gaxis);

Y.select('.domain').remove()


svg.append('text')
    .attr('x', width - margin.left - margin.right)
    .attr('y', height - margin.top - margin.bottom + 150)
    .text("Miles per Person per Year")
    .attr('font-weight', 'bold')
    .attr('font-size', 12)
    .call(halo)

svg.append('text')
    .attr('x', width - margin.left - margin.right - 410)
    .attr('y', height - 400)
    .attr('text-anchor', 'font')
    .text("Cost per Gallon")
    .attr("transform", d => "rotate(90)")
    .attr('font-size', 12)
    .attr('font-weight', 'bold')
    .call(halo)


const line = d3.line()
    .y(function(d) {
        return yAxis(d.gas)
    })
    .x(function(d) {
        return xAxis(d.miles)
    });

svg.append('path')
    .datum(data)
    .attr("class", "line")
    .attr('d', line)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", 'white');


let dot = svg.append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('g')

dot.append('circle')
    .attr('class', 'dot')
    .attr('cx', function (d) { 
        return xAxis(d.miles); } )
    .attr('cy', function (d) { 
        return yAxis(d.gas); } )
    .attr('r', 4)
    .attr('opacity', 1)
    .style('fill', 'white')
    .attr('stroke', 'black')

dot.append('text')
    .attr('class', 'label')
    .attr('x', function(d) {
        return xAxis(d.miles)
    })
    .attr('y', function(d) { 
        return yAxis(d.gas)
    })
    .attr('font-size', 10)
    .each(position)
    .text(function(d) {
        return d.year
    })
    .call(halo);

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
        case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
        case "right":
        t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
        break;
        case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
        case "left":
        t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
        break;
    }
    }

function halo(text) {
    text
        .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }

  })