<template>
  <div class="container">
    <h1>Family Tree Visualizer</h1>
    <div class="controls">
      <input v-model="jwtToken" type="password" placeholder="Paste your JWT token here" />
      <button @click="fetchFamilyTree">Load Family Tree</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div class="graph-container" v-if="nodes && Object.keys(nodes).length > 0">
       <v-network-graph
        :nodes="nodes"
        :edges="edges"
        :layouts="layouts"
        :configs="configs"
      />
    </div>
     <div v-else-if="!error && hasFetched" class="placeholder">
      No data to display. Load the tree to see the visualization.
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

// --- Reactive State ---
const jwtToken = ref("");
const nodes = ref({});
const edges = ref({});
const error = ref(null);
const hasFetched = ref(false);

const layouts = reactive({
  nodes: {},
});

// --- Graph Configuration ---
const configs = reactive({
  view: {
    layoutEngine: "force",
  },
  node: {
    label: {
      visible: true,
      fontFamily: "Helvetica",
      fontSize: 12,
      color: "#000000",
      margin: 4,
      direction: "south",
    },
    normal: {
      radius: 20,
      color: "#4466cc",
    },
     hover: {
      color: "#3355bb",
    },
  },
  edge: {
    normal: {
      color: "#aaa",
      width: 2,
    },
  },
});

// --- Methods ---
async function fetchFamilyTree() {
  if (!jwtToken.value) {
    error.value = "Please provide a JWT token.";
    return;
  }

  error.value = null;
  hasFetched.value = true;

  try {
    const response = await fetch('http://localhost:3000/api/family-tree', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken.value}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    processApiData(data);

  } catch (e) {
    console.error("Failed to fetch family tree:", e);
    error.value = `Failed to load data: ${e.message}`;
    nodes.value = {};
    edges.value = {};
  }
}

function processApiData(data) {
  const newNodes = {};
  const newEdges = {};
  
  if (!data.self) {
      error.value = "Invalid data from API: 'self' user is missing.";
      return;
  }

  const selfId = `node${data.self.id}`;

  // Add all people to the nodes list
  const allPeople = [
      data.self, 
      ...(data.adjacent || []), 
      ...(data.ancestors || []), 
      ...(data.descendants || [])
  ];

  allPeople.forEach((person, index) => {
    const nodeId = `node${person.id}`;
    newNodes[nodeId] = { 
        name: `${person.name}\n(${person.relationship})`,
        // Style the 'self' node differently
        ... (person.relationship === 'self' && { color: '#ff6f61', radius: 25 })
    };

    // Create edges from 'self' to all other nodes
    if (person.relationship !== 'self') {
        newEdges[`edge${index}`] = { source: selfId, target: nodeId };
    }
  });

  nodes.value = newNodes;
  edges.value = newEdges;
}
</script>

<style>
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.controls {
  margin-bottom: 20px;
}

.controls input {
  padding: 10px;
  margin-right: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.controls button {
  padding: 10px 15px;
  border: none;
  background-color: #4466cc;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background-color: #3355bb;
}

.graph-container {
  width: 80vw;
  height: 70vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.error {
  color: #ff0000;
  margin-bottom: 15px;
}

.placeholder {
    padding: 40px;
    color: #777;
}
</style>
