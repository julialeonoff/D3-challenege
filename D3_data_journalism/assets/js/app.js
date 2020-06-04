// Make it responsive
function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    };  

    // Define SVG area dimensions
    //var svgWidth = window.innerWidth;
    //var svgHeight = window.innerHeight;
    var svgWidth = 1000;
    var svgHeight = 660;

    // Define the chart's margins as an object
    var chartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 100
    };

    // Define dimensions of the chart area
    var width = svgWidth - chartMargin.left - chartMargin.right;
    var height = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area to it, and set the dimensions
    var svg = d3
            .select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

    // Append a group to the SVG area and shift ('translate') it to the right and down to adhere
    // to the margins set in the "chartMargin" object.
    var chartGroup = svg.append("g")
                        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    // Load in data
    d3.csv("assets/data/data.csv").then(function(health) {
        
        // Log to make sure it's being called in
        console.log(health);

        // Get values from data
        health.forEach(function(rates) {
            rates.poverty = +rates.poverty;
            rates.healthcare = +rates.healthcare;
        });

        // Create scales
        var xLinearScale = d3.scaleLinear()
                                .domain([8, d3.max(health, d => d.poverty) + 2])
                                .range([0, width]);

        var yLinearScale = d3.scaleLinear()
                                .domain([4, d3.max(health, d => d.healthcare) + 2])
                                .range([height, 0]);

        // Create axes
        var xAxis = d3.axisBottom(xLinearScale).ticks(6);
        var yAxis = d3.axisLeft(yLinearScale);

        // Append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        // Append circles
        var circles = chartGroup.selectAll("circle")
                                .data(health)
                                .enter()
                                .append("circle")
                                .classed("stateCircle", true)
                                .attr("cx", d => xLinearScale(d.poverty))
                                .attr("cy", d => yLinearScale(d.healthcare))
                                .attr("r", "10")
                                .attr("stroke-width", "1");

        // Add text to the circles ( after multiple attempts :s )

        // First tried this, and text w/ each state's abbreviation showed up in "Elements" (under each circle), but why wouldn't it
        // show up in the circles in the actual plot?
                //chartGroup.selectAll(".stateCircle")
                        // .append("text")
                        // .classed("stateText", true)
                        // .text(d => d.abbr)
                        // .attr("x", d => xLinearScale(d.poverty))
                        // .attr("y", d => yLinearScale(d.healthcare))
                        // .attr("alignment-baseline", "middle")
                        // .attr("font-size","12px");

        chartGroup.append("g")
                    .selectAll('text')
                    .data(health)
                    .enter()
                    .append("text")
                    .text(d => d.abbr)
                    .attr("x", d => xLinearScale(d.poverty))
                    .attr("y" ,d => yLinearScale(d.healthcare))
                    .classed(".stateText", true)
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .attr("font-size", "10px")
                    .attr("alignment-baseline", "central");
        
        // Tips 4 the tools, tools 4 the tips
        var toolTip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([80, -60])
                        .html(function(d) {
            return (`<strong>${d.state}</strong><br>Poverty Rate: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
        });

        // Create tooltip in chart
        chartGroup.call(toolTip);

        // Create event listeners to display and hide the tooltip
        circles.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });
    
        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - chartMargin.left + 30)
          .attr("x", 0 - (height / 2 + 40))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2 - 40}, ${height + 40})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
    
    });
};

makeResponsive();

d3.select(window).on("resize", makeResponsive);

