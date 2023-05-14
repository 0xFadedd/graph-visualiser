import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GraphVisualizer = () => {
  const [meals, setMeals] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/getMeals`);
      setMeals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/search?term=${searchTerm}`);
      setMeals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNodeSubmit = async (event) => {
    event.preventDefault();
    const node = {
      id: event.target.elements.nodeId.value,
      label: event.target.elements.nodeLabel.value,
    };

    try {
      const response = await axios.post(`${API_GATEWAY_URL}/addNode`, node);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdgeSubmit = async (event) => {
    event.preventDefault();
    const edge = {
      source: event.target.elements.sourceNodeId.value,
      target: event.target.elements.targetNodeId.value,
    };

    try {
      const response = await axios.post(`${API_GATEWAY_URL}/addEdge`, edge);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <h1>Graph Visualizer</h1>
      <div className="control-panel">
        <div className="control-item">
          <label htmlFor="filter">Filter:</label>
          <select id="filter" value={filter} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="meal">Meal</option>
            <option value="user">User</option>
            <option value="ingredient">Ingredient</option>
            <option value="allergen">Allergen</option>
            <option value="category">Category</option>
            <option value="nutrient">Nutrient</option>
          </select>
        </div>
        <div className="control-item">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            required
          />
          <button id="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div id="graph-container"></div>
      <div className="control-panel">
        <div className="control-item">
          <h2>Node Control</h2>
          <form onSubmit={handleNodeSubmit}>
            <label htmlFor="node-id">Node ID:</label>
            <input type="text" id="node-id" name="nodeId" required />
            <label htmlFor="node-label">Node Label:</label>
            <input type="text" id="node-label" name="nodeLabel" required />
            <button type="submit">Add Node</button>
            <button>Edit Node</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
