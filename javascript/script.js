// Combined Project 2 script.
// Each teammate's code/visualization is wrapped in its own function.

drawHousingChart();
drawFoodChart();
drawTransportationChart();

function drawHousingChart() {
  // dimensions
  const margin = { top: 60, right: 30, bottom: 50, left: 70 };
  const width = 900 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#housing-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const parseDate = d3.timeParse("%Y-%m-%d");

  d3.csv("data/housing2018-2026.csv", (d) => ({
    date: parseDate(d.observation_date),
    value: d.CUSR0000SAH1 === "" ? null : +d.CUSR0000SAH1,
  })).then((data) => {
    const clean = data.filter((d) => d.date !== null);
    clean.sort((a, b) => a.date - b.date);

    // year-over-year % change: compare each month to same month one year prior
    const dateMap = new Map(clean.map((d) => [d.date.getTime(), d.value]));

    const yoy = clean
      .map((d) => {
        const priorDate = new Date(d.date);
        priorDate.setFullYear(priorDate.getFullYear() - 1);
        const prior = dateMap.get(priorDate.getTime());
        if (prior == null || d.value == null) return null;
        return {
          date: d.date,
          change: ((d.value - prior) / prior) * 100,
          raw: d.value,
        };
      })
      .filter((d) => d !== null);

    // pre-pandemic baseline: mean YoY across all of 2019
    const baseline = d3.mean(
      yoy.filter((d) => d.date.getFullYear() === 2019),
      (d) => d.change,
    );

    // scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(yoy, (d) => d.date))
      .range([0, width]);

    const yExtent = d3.extent(yoy, (d) => d.change);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(yExtent[0] - 0.3, 0), yExtent[1] + 1.0])
      .range([height, 0]);

    // shade the 2024-present period first (behind everything else)
    const shadeStart = new Date(2024, 0, 1);
    svg
      .append("rect")
      .attr("class", "period-shade")
      .attr("x", xScale(shadeStart))
      .attr("y", 0)
      .attr("width", width - xScale(shadeStart))
      .attr("height", height);

    svg
      .append("text")
      .attr("class", "period-label")
      .attr("x", xScale(shadeStart) + 7)
      .attr("y", 15)
      .text("2024 – present");

    // gridlines
    svg
      .append("g")
      .attr("class", "gridlines")
      .call(d3.axisLeft(yScale).ticks(6).tickSize(-width).tickFormat(""));

    // axes
    svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeYear.every(1))
          .tickFormat(d3.timeFormat("%Y")),
      );

    svg
      .append("g")
      .attr("class", "axis y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(6)
          .tickFormat((d) => `${d.toFixed(1)}%`),
      );

    // axis labels
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .text("Year");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .text("Year-Over-Year Change (%)");

    // pre-pandemic baseline reference line
    svg
      .append("line")
      .attr("class", "baseline-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(baseline))
      .attr("y2", yScale(baseline));

    svg
      .append("text")
      .attr("class", "baseline-label")
      .attr("x", width - 4)
      .attr("y", yScale(baseline) - 5)
      .attr("text-anchor", "end")
      .text(`Pre-pandemic avg. ${baseline.toFixed(1)}%`);

    // line
    const lineGen = d3
      .line()
      .defined((d) => d.change !== null)
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.change));

    svg
      .append("path")
      .datum(yoy)
      .attr("class", "line line-cpi")
      .attr("stroke", "crimson")
      .attr("d", lineGen);

    // annotations for two key inflection points
    const annotations = [
      {
        date: new Date(2021, 11, 1), // Dec 2021 — surge clearly underway
        label: "Post-pandemic surge",
        sub: "Remote work & low rates drove rapid rent increases",
        anchor: "start",
        dx: 10,
        dy: -16,
      },
      {
        date: new Date(2023, 2, 1), // Mar 2023 — near peak
        label: "Peak: ~8% annual growth",
        sub: "Fastest pace since the early 1980s",
        anchor: "end",
        dx: -10,
        dy: 20,
      },
    ];

    annotations.forEach((a) => {
      const point = yoy.find(
        (d) =>
          d.date.getFullYear() === a.date.getFullYear() &&
          d.date.getMonth() === a.date.getMonth(),
      );
      if (!point) return;
      const ax = xScale(point.date);
      const ay = yScale(point.change);

      svg
        .append("circle")
        .attr("class", "annotation-dot")
        .attr("cx", ax)
        .attr("cy", ay)
        .attr("r", 4);

      svg
        .append("text")
        .attr("class", "annotation-label")
        .attr("x", ax + a.dx)
        .attr("y", ay + a.dy)
        .attr("text-anchor", a.anchor)
        .text(a.label);

      svg
        .append("text")
        .attr("class", "annotation-sub")
        .attr("x", ax + a.dx)
        .attr("y", ay + a.dy + 14)
        .attr("text-anchor", a.anchor)
        .text(a.sub);
    });

    // chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .text("U.S. Housing CPI — Year-Over-Year Change, 2019–2026");

    // tooltip
    const tooltip = d3.select("#tooltip");

    const hoverLine = svg
      .append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("display", "none");

    const hoverDot = svg
      .append("circle")
      .attr("class", "hover-dot")
      .attr("r", 5)
      .style("display", "none");

    const bisect = d3.bisector((d) => d.date).left;

    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event);
        const hoverDate = xScale.invert(mx);
        const i = bisect(yoy, hoverDate);
        const d0 = yoy[i - 1];
        const d1 = yoy[i];
        if (!d0 && !d1) return;
        const d = !d0
          ? d1
          : !d1
            ? d0
            : hoverDate - d0.date < d1.date - hoverDate
              ? d0
              : d1;

        const cx = xScale(d.date);
        const cy = yScale(d.change);

        hoverLine.style("display", null).attr("x1", cx).attr("x2", cx);
        hoverDot.style("display", null).attr("cx", cx).attr("cy", cy);

        const fmt = d3.timeFormat("%B %Y");
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 14 + "px")
          .style("top", event.pageY - 36 + "px")
          .html(
            `<strong>${fmt(d.date)}</strong><br>YoY change: ${d.change.toFixed(2)}%<br>CPI index: ${d.raw.toFixed(3)}`,
          );
      })
      .on("mouseleave", function () {
        hoverLine.style("display", "none");
        hoverDot.style("display", "none");
        tooltip.style("display", "none");
      });
  });
}

function drawFoodChart() {
  // Constants / global variables
  const w = 1100;
  const h = 900;
  const margin = 70;

  // Parse date format
  const parseTime = d3.timeParse("%Y-%m-%d");

  // Load CSV file
  d3.csv("data/2024to2026FoodInflation.csv").then((data) => {
    console.log("data", data);

    // Convert data types
    data.forEach((d) => {
      d.observation_date = parseTime(d.observation_date);
      d.CPIUFDSL = +d.CPIUFDSL;
    });

    // X scale
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.observation_date))
      .range([margin, w - margin]);

    // Y scale
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.CPIUFDSL) - 1,
        d3.max(data, (d) => d.CPIUFDSL) + 1,
      ])
      .range([h - 220, margin]);

    // Bottom axis
    const bottomAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickFormat(d3.timeFormat("%b %Y"));

    // Left axis
    const leftAxis = d3.axisLeft().scale(yScale);

    // Create SVG
    const svg = d3
      .select("#food-chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Chart title
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "22px")
      .style("font-weight", "bold")
      .text("Food Inflation Index (2024–2026)");

    // Chart description
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Monthly U.S. Food Consumer Price Index (CPIUFDSL)");

    // Line generator
    const line = d3
      .line()
      //.curve(d3.curveNatural)
      .x((d) => xScale(d.observation_date))
      .y((d) => yScale(d.CPIUFDSL));

    // Draw line
    svg.append("path").datum(data).attr("class", "line").attr("d", line);

    // X-axis
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${h - 220})`)
      .call(bottomAxis)
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    // Y-axis
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin},0)`)
      .call(leftAxis);

    // X-axis label
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", h - 170)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Date");

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(h - 220) / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Food Inflation Index");

    // Analysis header
    svg
      .append("text")
      .attr("x", margin)
      .attr("y", h - 120)
      .style("font-size", "15px")
      .style("font-weight", "bold")
      .text("Key Insights:");

    // Analysis text
    svg
      .append("text")
      .attr("x", margin)
      .attr("y", h - 90)
      .attr("class", "analysis-text")
      .text(
        "• U.S. food prices remained persistently high after earlier inflationary periods.",
      );

    svg
      .append("text")
      .attr("x", margin)
      .attr("y", h - 65)
      .attr("class", "analysis-text")
      .text(
        "• Policies aimed at controlling inflation slowed extreme growth but did not reduce prices significantly.",
      );

    svg
      .append("text")
      .attr("x", margin)
      .attr("y", h - 40)
      .attr("class", "analysis-text")
      .text(
        "• External events such as geopolitical conflicts, labor shortages, and supply-chain disruptions continued influencing food costs.",
      );

    svg
      .append("text")
      .attr("x", margin)
      .attr("y", h - 15)
      .attr("class", "analysis-text")
      .text(
        "• The sudden crash in late 2025 is likely related to the government shutdown, which may have interrupted Federal Reserve data reporting and resulted in missing data.",
      );
  });
}

function drawTransportationChart() {
  // Load the CPI file processed and cleaned in Python.
  const csvFile = "data/transportation_cpi_2024_2026_processed.csv";

  // Set chart dimensions.
  const margin = { top: 55, right: 230, bottom: 85, left: 70 };
  const width = 980 - margin.left - margin.right;
  const height = 430 - margin.top - margin.bottom;

  // Set formatting.
  const parseDate = d3.timeParse("%Y-%m-%d");
  const formatMonth = d3.timeFormat("%b %Y");
  const formatShortMonth = d3.timeFormat("%b '%y");
  const formatPct = d3.format("+.2f");
  const formatIndex = d3.format(".3f");

  // Create the SVG container.
  const svg = d3
    .select("#transportation-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Load and process the data for the bar chart.
  d3.csv(csvFile).then((rawData) => {
    const data = rawData
      .map((d) => ({
        date: parseDate(d.observation_date),
        cpi: +d.transportation_cpi,
        mom: d.mom_percent_change === "" ? null : +d.mom_percent_change,
        yoy: d.yoy_percent_change === "" ? null : +d.yoy_percent_change,
      }))
      .filter((d) => d.mom !== null && !Number.isNaN(d.mom));

    // Build scales for monthly bars and percent change values.
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .padding(0.25);

    const yLimit = d3.max(data, (d) => Math.abs(d.mom));

    const y = d3
      .scaleLinear()
      .domain([-yLimit * 1.15, yLimit * 1.15])
      .range([height, 0])
      .nice();

    // Draw the horizontal zero line.
    chart
      .append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(0))
      .attr("y2", y(0));

    // Draw x-axis with rotated month labels.
    chart
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(formatShortMonth).tickSizeOuter(0))
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .attr("dx", "-0.5em")
      .attr("dy", "0.15em");

    // Draw y-axis in percent units.
    chart
      .append("g")
      .attr("class", "axis")
      .call(
        d3
          .axisLeft(y)
          .ticks(6)
          .tickFormat((d) => `${d}%`),
      );

    // Add y-axis label.
    chart
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -margin.left + 5)
      .attr("y", -22)
      .text("Monthly percent change in Transportation CPI");

    const tooltip = d3.select("#tooltip");

    // Draw bars. March and April 2026 are highlighted because they are the clearest recent pressure months.
    chart
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", (d) => {
        const isHighlight =
          d.date.getFullYear() === 2026 && [2, 3].includes(d.date.getMonth());

        if (isHighlight) {
          return "bar bar-highlight";
        }

        return d.mom >= 0 ? "bar bar-positive" : "bar bar-negative";
      })
      .attr("x", (d) => x(d.date))
      .attr("y", (d) => (d.mom >= 0 ? y(d.mom) : y(0)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => Math.abs(y(d.mom) - y(0)))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(`
              <strong>${formatMonth(d.date)}</strong><br>
              CPI index: ${formatIndex(d.cpi)}<br>
              Monthly change: ${formatPct(d.mom)}%<br>
              Yearly change: ${
                d.yoy === null || Number.isNaN(d.yoy)
                  ? "N/A"
                  : formatPct(d.yoy) + "%"
              }
            `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 14}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    // Label only the biggest changes so the chart stays readable.
    const peakLabels = data.filter(
      (d) =>
        (d.date.getFullYear() === 2026 && [2, 3].includes(d.date.getMonth())) ||
        Math.abs(d.mom) >= 1.2,
    );

    chart
      .selectAll(".value-label")
      .data(peakLabels)
      .join("text")
      .attr("class", "value-label")
      .attr("x", (d) => x(d.date) + x.bandwidth() / 2)
      .attr("y", (d) => (d.mom >= 0 ? y(d.mom) - 8 : y(d.mom) + 16))
      .attr("text-anchor", "middle")
      .text((d) => `${formatPct(d.mom)}%`);

    // Add one simple annotation for the clearest spike.
    const march2026 = data.find(
      (d) => d.date.getFullYear() === 2026 && d.date.getMonth() === 2,
    );

    if (march2026) {
      const xMid = x(march2026.date) + x.bandwidth() / 2;
      const yTop = y(march2026.mom);

      chart
        .append("line")
        .attr("class", "annotation-line")
        .attr("x1", xMid)
        .attr("x2", width + 32)
        .attr("y1", yTop)
        .attr("y2", yTop - 38);

      chart
        .append("text")
        .attr("class", "annotation-text")
        .attr("x", width + 42)
        .attr("y", yTop - 52)
        .text("March 2026: Iran war fuel shock");

      chart
        .append("text")
        .attr("class", "annotation-note")
        .attr("x", width + 42)
        .attr("y", yTop - 34)
        .text("CBS reported gasoline");

      chart
        .append("text")
        .attr("class", "annotation-note")
        .attr("x", width + 42)
        .attr("y", yTop - 18)
        .text("rose 21.2% in March.");

      chart
        .append("text")
        .attr("class", "annotation-note")
        .attr("x", width + 42)
        .attr("y", yTop - 2)
        .text("AP linked the price jump");

      chart
        .append("text")
        .attr("class", "annotation-note")
        .attr("x", width + 42)
        .attr("y", yTop + 14)
        .text("to the Iran war.");
    }

    // Add a compact legend.
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${height + margin.top + 62})`,
      );

    const legendItems = [
      { label: "Monthly increase", className: "legend-box-positive" },
      { label: "Monthly decrease", className: "legend-box-negative" },
      { label: "Highlighted 2026 peak", className: "legend-box-highlight" },
    ];

    const legendGroup = legend
      .selectAll(".legend-item")
      .data(legendItems)
      .join("g")
      .attr("transform", (d, i) => `translate(${i * 190},0)`);

    legendGroup
      .append("rect")
      .attr("class", (d) => d.className)
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 3);

    legendGroup
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 22)
      .attr("y", 12)
      .text((d) => d.label);
  });
}
