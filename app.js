const visualization = document.getElementById("visualization");
const filterBtn = document.getElementById("filter-btn");
const search = document.getElementById("search");

// Update this with your API Gateway URL
const API_GATEWAY_GETTER = "https://h9lg7j6rwb.execute-api.eu-west-2.amazonaws.com/v1";
const API_GATEWAY_SETTER = "https://k0o8epj10d.execute-api.eu-west-2.amazonaws.com/v1";

// Fetch data and visualize the graph
async function fetchDataAndVisualize() {
  const meals = await fetchMeals();
  visualizeData(meals);
}

// Fetch meal data from the API
async function fetchMeals() {
    const response = await axios.get(`${API_GATEWAY_URL}/getMeals`);
    const meals = response.data;
    return meals;
  }

// Visualize the data in the DOM
function visualizeData(meals) {
  const mealNodes = meals.map(createMealNode);
  visualization.innerHTML = "";
  visualization.append(...mealNodes);
}

// Create a DOM element for a meal node
function createMealNode(meal) {
  const node = document.createElement("div");
  node.classList.add("node");

  const title = document.createElement("h3");
  title.textContent = meal.name;

  const edges = meal.edges.map(createEdgeElement);
  const edgeList = document.createElement("ul");
  edgeList.append(...edges);

  node.append(title, edgeList);
  return node;
}

// Create a DOM element for an edge
function createEdgeElement(edge) {
  const li = document.createElement("li");
  li.classList.add("edge");
  li.textContent = `${edge.source} -[${edge.label}]-> ${edge.destination}`;
  return li;
}

// Filter data based on the search input
filterBtn.addEventListener("click", async () => {
  const searchTerm = search.value;
  if (!searchTerm) return;
  const meals = await fetchMeals();
  const filteredMeals = meals.filter(meal => 
    meal.name.includes(searchTerm) || 
    meal.edges.some(edge => edge.label.includes(searchTerm))
  );
  visualizeData(filteredMeals);
});

// Event listener for the search button
const searchBtn = document.getElementById("search-btn");

// Search for nodes and edges
async function searchNodesAndEdges(term) {
  const meals = await fetchMeals();
  const matchingMeals = meals.filter(meal =>
    meal.name.includes(term) ||
    meal.edges.some(edge => edge.label.includes(term) || edge.source.includes(term) || edge.destination.includes(term))
  );
  return matchingMeals;
}

// Event listener for the search button
searchBtn.addEventListener("click", async () => {
  const searchTerm = search.value;
  if (!searchTerm) return;
  const matchingMeals = await searchNodesAndEdges(searchTerm);
  visualizeData(matchingMeals);
});


// Add a new node
async function addNode(node) {
    const response = await axios.post(`${API_GATEWAY_URL}/addNode`, node);
    return response.data;
}
  

// Add a new edge
async function addEdge(edge) {
    const response = await axios.post(`${API_GATEWAY_URL}/addEdge`, edge);
    return response.data;
  }

fetchDataAndVisualize();

document.getElementById('add-node-btn').addEventListener('click', async function() {
  const nodeId = document.getElementById('node-id').value;
  const nodeLabel = document.getElementById('node-label').value;

  const data = await addNode({ id: nodeId, label: nodeLabel });
  // TODO: add code to update the graph
});

document.getElementById('edit-node-btn').addEventListener('click', async function() {
  const nodeId = document.getElementById('node-id').value;
  const nodeLabel = document.getElementById('node-label').value;

  const response = await axios.put(`${API_GATEWAY_URL}/nodes/${nodeId}`, { label: nodeLabel });
  const data = response.data;
  // TODO: add code to update the graph
});

document.getElementById('add-edge-btn').addEventListener('click', async function() {
  const sourceNodeId = document.getElementById('source-node-id').value;
  const targetNodeId = document.getElementById('target-node-id').value;

  const data = await addEdge({ source: sourceNodeId, target: targetNodeId });
  // TODO: add code to update the graph
});

document.getElementById('edit-edge-btn').addEventListener('click', function() {
  // Since edges usually cannot be edited directly (depends on your graph structure),
  // you might need to delete the old edge and create a new one.
  // If they can be edited, you can replace this with the appropriate API call.
  alert('Please delete the old edge and create a new one.');
});
  