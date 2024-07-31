function createTopShoesChart() {
    const endDate = new Date(); // Current date
    const startDate = new Date(); // Date 3 months ago
    startDate.setMonth(startDate.getMonth() - 3);

    // Fetch top-selling shoes data from the server
    fetch(`/api/shoes/top-sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .then(response => response.json())
        .then(data => {
            const margin = {top: 120, right: 20, bottom: 120, left: 50}; // Chart margins

            function renderChart() {
                const containerWidth = document.getElementById('top-shoes-chart').clientWidth;
                const width = containerWidth - margin.left - margin.right;
                const height = 600 - margin.top - margin.bottom;

                d3.select("#top-shoes-chart").selectAll("*").remove(); // Clear previous chart
                const svg = d3.select("#top-shoes-chart")
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", `translate(${margin.left},${margin.top})`);

                const x = d3.scaleBand()
                    .range([0, width])
                    .padding(0.1);
                const y = d3.scaleLinear()
                    .range([height, 0]);

                x.domain(data.map(d => d.title)); // X-axis domain
                y.domain([0, d3.max(data, d => d.totalSales)]); // Y-axis domain

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", d => x(d.title))
                        .attr("width", x.bandwidth())
                        .attr("y", d => y(d.totalSales))
                        .attr("height", d => height - y(d.totalSales))
                        .attr("fill", "steelblue"); // Bar color

                svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.5em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate(-45)");

                svg.append("g")
                    .call(d3.axisLeft(y));

                svg.append("text")
                    .attr("class", "chart-title")
                    .attr("x", width / 2)
                    .attr("y", 0 - (margin.top / 2) + 20)
                    .attr("text-anchor", "middle")
                    .text("Top Selling Shoes"); // Chart title

                svg.append("text")
                    .attr("class", "chart-subtitle")
                    .attr("x", width / 2)
                    .attr("y", 0 - (margin.top / 2) + 40)
                    .attr("text-anchor", "middle")
                    .text("Sales data for the last quarter"); // Chart subtitle
            }

            renderChart(); // Initial render
            window.addEventListener('resize', renderChart); // Re-render on window resize
        });
}

function createGenderSalesChart() {
    console.log("Starting to create gender sales chart");
    const endDate = new Date(); // Current date
    const startDate = new Date(); // Date 3 months ago
    startDate.setMonth(startDate.getMonth() - 3);

    console.log(`Fetching gender sales data from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Fetch gender sales data from the server
    fetch(`/api/shoes/gender-sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            if (!data || data.length === 0) {
                console.log("No data available for gender sales chart");
                document.getElementById('gender-sales-chart').innerHTML = "No sales data available for the selected period. Please try a different date range.";
                return;
            }

            // Process data for the chart
            const processedData = data.map(item => ({
                gender: item.gender === 'Men' ? 'Men' : 
                        item.gender === 'Women' ? 'Women' : 'Kids',
                totalSales: item.totalSales
            }));

            // Create the chart
            createChart(processedData);

            // Add event listener for window resize
            window.addEventListener('resize', () => createChart(processedData));
        })
        .catch(error => {
            console.error("Error in createGenderSalesChart:", error);
            document.getElementById('gender-sales-chart').innerHTML = "Error loading gender sales chart";
        });
}

function createChart(data) {
    const margin = {top: 50, right: 30, bottom: 50, left: 60}; // Chart margins
    const containerWidth = document.getElementById('gender-sales-chart').clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#gender-sales-chart").selectAll("*").remove(); // Clear previous chart
    const svg = d3.select("#gender-sales-chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(data.map(d => d.gender)); // X-axis domain
    y.domain([0, d3.max(data, d => d.totalSales)]); // Y-axis domain

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.gender))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.totalSales))
            .attr("height", d => height - y(d.totalSales))
            .attr("fill", "steelblue"); // Bar color

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Sales by Gender for the Last Quarter"); // Chart title

    // Add labels to bars
    svg.selectAll(".label")
        .data(data)
        .enter().append("text")
            .attr("class", "label")
            .attr("x", d => x(d.gender) + x.bandwidth() / 2)
            .attr("y", d => y(d.totalSales) - 5)
            .attr("text-anchor", "middle")
            .text(d => d.totalSales); // Bar labels
}

$(document).ready(function() {
    $('#store-stats-btn').click(function(event) {
        event.preventDefault(); // Prevent default button behavior
        hideAllSections(); // Hide all sections
        $('#store-stats').show(); // Show store stats section
        createTopShoesChart(); // Create top shoes chart
        createGenderSalesChart(); // Create gender sales chart
    });

    // Initial call to create charts on page load
    createTopShoesChart();
    createGenderSalesChart();
});
