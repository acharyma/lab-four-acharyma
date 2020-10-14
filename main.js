d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    
    console.log('Wealth Health', data);

    const margin = ({top: 20, right: 20, bottom: 20, left: 20});
    const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    const svg = d3.select(".chart").append("svg").attr("width", width + margin.left + margin.right) .attr("height", height + margin.top + margin.bottom) .append("g") .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let domainIncome = d3.extent(data,(d => d.Income));
    let domainLifeExpectancy = d3.extent(data, (d => d.LifeExpectancy))

    const xScale = d3.scaleLinear().domain(domainIncome).range([0, width]);
    const yScale = d3.scaleLinear().domain(domainLifeExpectancy).range([height, 0]);

    const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s");
    const yAxis = d3.axisLeft().scale(yScale);
    
    const ordinalColorScale = d3.scaleOrdinal(d3.schemeTableau10);

    svg.append("g")
    .attr("class", "axis x-axis").attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 30)
        .attr("y", height - 10)
        .text("Income in Dollars");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y",8)
        .attr("dy", "6px")
        .attr("transform", "rotate(-90)")
        .text("Life Expectancy in Years")
        .style("font-size", "10px");
    


    

    svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", (d) => ordinalColorScale(d.Region))
    .attr('cx', d=>xScale(d.Income))
    .attr('cy', d=>yScale(d.LifeExpectancy))
    .attr("r", (d) => (d.Population < 75000000 ) ? 4 : (d.Population < 300000000) ? 8 : 12)
    .on("mouseenter", (event, d) => {
        // show the tooltip
        const pos = d3.pointer(event, window);
        d3
        .select(".tooltip")
        .style("position", "fixed")
        .style("left", pos[0] + 10 + "px")
        .style("top", pos[1] + 10 + "px")
        .style("padding", 5 + "px")
        .style("background", "darkgrey")
        .style("font-size", "9px")
        .style("display", "block").html(`
            <div>
            <span>
            Country:</span>
            <span>
            ${d.Country}</span>
            </div>
            
            <div>
            <span>
            Region:</span>
            <span>
            ${d.Region}</span>
            </div>
            
            <div>
            <span>
            Income:</span>
            <span>
            ${"$" + d3.format(",.2r")(d.Income)}</span>
            </div>

            <div>
            <span>
            Population:</span>
            <span>
            ${d3.format(",.2r")(d.Population)}</span>
            </div>
            
            <div>
            <span>
            Life Expectancy:</span>
            <span>
            ${d.LifeExpectancy}</span>
            </div>
        `);
    })
    .on("mouseleave", (event, d) => {
        // hide the tooltip
        d3.select(".tooltip").style("display","none");
    });

    const legendInfo = new Set(data.map((d) => d.Region));
    console.log(legendInfo);

    svg
    .append("g")
    .selectAll("squares")
    .data(legendInfo)
    .enter()
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", width - 120)
    .attr("y", (d, i) => height + i * 20 - 185)
    .attr("fill", (d) => ordinalColorScale(d));

    svg
    .append("g")
    .selectAll("legendTags")
    .data(legendInfo)
    .enter()
    .append("text")
    .attr("x", width - 105)
    .attr("y", (d, i) => height + i * 20 - 176)
    .text((d) => d)
    .attr("font-size", "10px");

});