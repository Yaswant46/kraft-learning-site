// Load knowledge graph
async function loadGraph() {
  const data = await fetch("data/graph.json").then(res => res.json());
  const width = 800, height = 400;
  const svg = d3.select("#graph")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g").attr("stroke", "#999")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("stroke-width", 2);

  const node = svg.append("g").attr("stroke", "#fff")
    .selectAll("circle")
    .data(data.nodes)
    .enter().append("circle")
    .attr("r", 8)
    .attr("fill", "#1f77b4")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    );

  node.append("title").text(d => d.name);

  simulation.on("tick", () => {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x; d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }
}

async function loadVideos() {
  const list = document.getElementById("video-list");
  const videos = await fetch("data/videos.json").then(res => res.json());
  videos.forEach(v => {
    const wrapper = document.createElement("div");
    wrapper.style.margin = "1rem 0";
    wrapper.innerHTML = `<h3>${v.title}</h3><iframe width="560" height="315" src="https://www.youtube.com/embed/${v.id}" frameborder="0" allowfullscreen></iframe>`;
    list.appendChild(wrapper);
  });
}

if (document.getElementById("graph")) loadGraph();
if (document.getElementById("video-list")) loadVideos();
