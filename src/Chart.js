import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    "user": "Rm6vnmNPRvz",
                    "value": 11,
                    "category": 7
                },
                {
                    "user": "cB0hC",
                    "value": 9,
                    "category": 7
                },
                {
                    "user": "xFapEXx9",
                    "value": 12,
                    "category": 9
                },
                {
                    "user": "stHdo1TV",
                    "value": 6,
                    "category": 10
                },
                {
                    "user": "NlUafWkpjduC3",
                    "value": 10,
                    "category": 7
                },
                {
                    "user": "e7DwVrmJ",
                    "value": 7,
                    "category": 6
                },
                {
                    "user": "uEOJsO",
                    "value": 6,
                    "category": 14
                },
                {
                    "user": "zlTNlewuDKcRl",
                    "value": 13,
                    "category": 8
                },
                {
                    "user": "BQlhXiIHXUo42I",
                    "value": 12,
                    "category": 14
                },
                {
                    "user": "SO6lM",
                    "value": 5,
                    "category": 5
                },
                {
                    "user": "kn3LTrlFv6",
                    "value": 5,
                    "category": 11
                },
                {
                    "user": "rFKwr3vSxco3K7",
                    "value": 7,
                    "category": 9
                },
                {
                    "user": "1gzvu",
                    "value": 11,
                    "category": 14
                },
                {
                    "user": "BL ymOGU",
                    "value": 13,
                    "category": 10
                },
                {
                    "user": "vwEH33kh8 Bhny",
                    "value": 6,
                    "category": 5
                }
            ]
        }
    }
    componentDidMount() {
        const { margin, width, height } = this.props;

        const total = this.state.data.reduce((r, d) => r + d.category, 0);
        const average = this.state.data.map((d) => ({
            ...d,
            avg: Math.floor((d.category * total) / 100)
        }));

        const xScale = d3.scaleLinear()
            .domain([5, this.state.data.length - 1])
            .range([0, width].sort((a, b) => a - b));
        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        const line = d3.line()
            .x(d => xScale(d.category))
            .y(d => yScale(d.avg));

        const graph = d3.select("#graph").append("svg:svg")
            .attr("width", width + margin[1] + margin[3])
            .attr("height", height + margin[0] + margin[2])
            .append("svg:g")
            .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale)
            .ticks(10)
            .tickSize(-width)
            .tickSizeOuter(0)
            .tickFormat(function (d) { return d + "%" });;



        const rect = graph.append("rect")
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#ffffff');

        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        graph.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxis);

        const mainLine = graph.append("path").datum(average)
            .attr('id', 'line')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr("d", line(average));

        const verticalLine = graph.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x1', 0)
            .attr('y1', height)
            .attr("stroke", "steelblue")
            .attr('class', 'verticalLine');

        const horizontallLine = graph.append('line')
            .attr("x1", 0)
            .attr("y1", 15)
            .attr("x2", width)
            .attr("y2", 15)
            .attr("stroke", "steelblue")
            .attr('class', 'horizontalLine');


        const circle = graph.append("circle")
            .attr("opacity", 0)
            .attr('r', 10)
            .attr('fill', 'darkred');

        const container = graph.append("g");
        const focusRectt = container.append("rect")
            .attr("class", "tooltip")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("width", 200)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        const focusText = container.append("text")
            .attr("class", "tooltip-text")
            .attr("x", 18)
            .attr("y", -2)
            .attr("fill", "black");

        const bisect = d3.bisector(function (d) { return d.category; }).left;

        let selectedData;
        rect.on("mouseover", function () {
            d3.selectAll(".tooltip-text").raise();
        });
        rect.on('mousemove', function () {
            const xPos = d3.mouse(this)[0];
            const yPos = d3.mouse(this)[1];
            const index = bisect(average, xScale.invert(xPos));
            selectedData = average[index];
            console.log('ye', selectedData, xScale.invert(xPos));


            d3.select(".verticalLine").attr("transform", function () {
                return "translate(" + xPos + ",0)";
            });
            d3.select(".horizontalLine").attr("transform", function () {
                return "translate(0," + yPos + " )";
            });

            const pathLength = mainLine.node().getTotalLength();
            const x = xPos;
            let beginning = x,
                end = pathLength,
                target,
                pos;

            while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = mainLine.node().getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== x) {
                    break;
                }
                if (pos.x > x) end = target;
                else if (pos.x < x) beginning = target;
                else break;
            }
            circle.attr("opacity", 1)
                .attr("cx", x)
                .attr("cy", pos.y);

            focusRectt.attr("opacity", 1)
                .attr("x", xPos + 10)
                .attr("y", yPos + 10);

            focusText.attr("x", xPos + 30)
                .attr("y", yPos + 40)
                .text(function () { if (selectedData) return 'User: ' + selectedData.user; });
        });


    }
    render() {

        return (
            <div id="graph">
            </div>
        )
    }
}
export default Chart;