import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

const NetworkGraph = ({
  inputnodes,
  inputedges,
  modifierchanger,
  currentresponsestuff,
  onNodeClick,
  updateNodes,
  key,
}) => {
  const networkRef = useRef(null);
  const [hasError, setHasError] = useState(false); // State to track errors

  useEffect(() => {
    try {
      const graph_node_data = inputnodes.map((node) => ({
        id: node.id,
        label: node.label,
        shape: node.shape,
        brokenImage: node.brokenImage,
        image: node.image,
        size: node.size,
        shapeProperties: node.shapeProperties || {}, // empty object if it doesn't exist
        value: node.value,
        title: node.title,
      }));

      const graph_edges_data = inputedges.map((edge) => ({
        from: edge.from,
        to: edge.to,
      }));

      // Nodes and edges data
      const nodes = new DataSet(graph_node_data);
      const edges = new DataSet(graph_edges_data);

      // Configuration for the Network
      const options = {
        edges: {
          width: 2, // Sets the edge width to 2 pixels
        },
        nodes: {
          font: {
            color: "#F03967", //"#FFFFFF",
            size: 15,
            face: "arial",
          },
          color: {
            background: "#ddebe3", // Default background color
            border: "#21402e", // Color of the border
            highlight: {
              // Color when a node is selected
              background: "#defaea",
              border: "#498c65",
            },
          },
        },
      };

      // Initialize network
      const network = new Network(
        networkRef.current,
        { nodes, edges },
        options
      );

      // ------------- Adding an event listener for click events --------------------
      network.on("click", function (params) {
        // params is an object that contains information about the click event
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          console.log("Clicked node id:", nodeId);

          const listOfModifiers =
            JSON.parse(currentresponsestuff).responseData.listOfModifiers;
          const clickedNode = "Node" + nodeId;

          // Call the callback function with the clicked node
          if (typeof onNodeClick === "function") {
            //updathe the list of nodes
            updateNodes(inputnodes);
            onNodeClick([clickedNode, inputnodes[nodeId].label]);
          }

          // Rest of your code...
        } else if (params.edges.length > 0) {
          const edgeId = params.edges[0]; // Get the id of the clicked edge
          // Execute your code for when an edge is clicked
          console.log("Clicked edge id:", edgeId);

          // Similarly, you can use edgeId for edge-specific actions
        }
      });
    } catch (error) {
      console.error("Error creating network graph:", error);
      setHasError(true); // Set error state to true
    }
  }, [inputnodes, inputedges]);

  if (hasError) {
    return <div>Unable to display the graph. Please try again later.</div>;
  }

  return <div ref={networkRef} style={{ height: "100%", width: "100%" }} />;
};

export default NetworkGraph;
