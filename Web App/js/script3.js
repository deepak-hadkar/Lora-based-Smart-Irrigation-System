const margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 40,
  };
  
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  const x = d3.scaleTime()
	.range([0, width]);
  
  const y = d3.scaleLinear()
	.range([height, 0]);
  
  const container = d3.select('body')
	.append('div')
	.attr('class', 'container');
  
  container.append('h1')
	.text('Gross Domestic Product, USA');
  
  container.append('h4')
	.text('1947 - 2015');
  
  const svg = container.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.left + margin.right)
	.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  container.append('span')
	.attr('class', 'notes')
	.text('Units: Billions of Dollars Seasonal Adjustment: Seasonally Adjusted Annual Rate Notes: A Guide to the National Income and Product Accounts of the United States (NIPA) - (http://www.bea.gov/national/pdf/nipaguid.pdf)');
  
  fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
	.then(res => res.json())
	.then((json) => {
	  const data = [...json.data];
  
	  const minYear = new Date(data.slice(0, 1)[0][0]);
	  const maxYear = new Date(data.slice(-1)[0][0]);
  
	  x.domain([minYear, maxYear]);
	  y.domain([0, d3.max(data, d => d[1])]);
  
	  const tip = d3.select('body')
		.append('div')
		.attr('class', 'tooltip');
  
	  const format = d3.timeFormat('%Y - %B');
  
	  svg.selectAll('.bar')
		.data(data)
		.enter().append('rect')
		.attr('class', 'bar')
		.attr('x', d => x(new Date(d[0])))
		.attr('width', width / data.length)
		.attr('y', d => y(d[1]))
		.attr('height', d => height - y(d[1]))
		.on('mousemove', (d) => {
		  tip
			.style('position', 'absolute')
			.style('left', `${d3.event.pageX + 10}px`)
			.style('top', `${d3.event.pageY + 20}px`)
			.style('display', 'inline-block')
			.style('opacity', '0.9')
			.html(`<div><strong>$${d[1]} Billion</strong></div> <span>${format(new Date(d[0]))}</span>`);
		})
		.on('mouseout', () => tip.style('display', 'none'));
  
	  svg.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x));
  
	  svg.append('g')
		.call(d3.axisLeft(y));
	});