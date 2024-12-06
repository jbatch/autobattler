// gameStateManager.ts

import { GameMap, GameState, MapNode, NodeType } from "@/types";

const INITIAL_GOLD = 100;
const MIN_NODES_PER_LAYER = 2;
const MAX_NODES_PER_LAYER = 3;
const NUM_LAYERS = 5;
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;
const MIN_NODE_DISTANCE = 120; // Minimum distance between nodes
const LAYER_SPACING = MAP_WIDTH / (NUM_LAYERS - 1); // Horizontal space between layers

export const createInitialGameState = (): GameState => ({
  gold: INITIAL_GOLD,
  map: generateMap(1),
  currentNodeId: null,
  level: 1,
  playerTeam: [],
});

interface Point {
  x: number;
  y: number;
}

const generateMap = (level: number): GameMap => {
  const layers: MapNode[][] = [];
  const nodes: MapNode[] = [];
  let nodeId = 0;

  // Generate layers and nodes as before...
  for (let layer = 0; layer < NUM_LAYERS; layer++) {
    const numNodesInLayer = Math.floor(
      Math.random() * (MAX_NODES_PER_LAYER - MIN_NODES_PER_LAYER + 1) +
        MIN_NODES_PER_LAYER
    );

    const layerNodes: MapNode[] = [];

    for (let i = 0; i < numNodesInLayer; i++) {
      const node: MapNode = {
        id: `node-${nodeId++}`,
        type: layer === NUM_LAYERS - 1 ? "boss" : getRandomNodeType(),
        position: {
          x: layer * LAYER_SPACING,
          y: 0,
        },
        connections: [],
        completed: false,
        available: layer === 0,
      };
      layerNodes.push(node);
    }

    // Position nodes vertically as before...
    const spacing = MAP_HEIGHT / (numNodesInLayer + 1);
    layerNodes.forEach((node, index) => {
      node.position.y = spacing * (index + 1);
      const randomOffset = (Math.random() - 0.5) * spacing * 0.5;
      node.position.y = Math.max(
        MIN_NODE_DISTANCE,
        Math.min(MAP_HEIGHT - MIN_NODE_DISTANCE, node.position.y + randomOffset)
      );
    });

    layers.push(layerNodes);
    nodes.push(...layerNodes);
  }

  // Generate initial connections as before...
  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const currentLayer = layers[layerIndex];

    currentLayer.forEach((node) => {
      const numConnections = Math.random() < 0.7 ? 2 : 1;
      const nextLayer = layers[layerIndex + 1];
      const possibleTargets = [...nextLayer];

      if (layerIndex < layers.length - 2 && Math.random() < 0.3) {
        possibleTargets.push(...layers[layerIndex + 2]);
      }

      possibleTargets.sort((a, b) => {
        const distA = Math.abs(a.position.y - node.position.y);
        const distB = Math.abs(b.position.y - node.position.y);
        return distA - distB;
      });

      for (let i = 0; i < numConnections && possibleTargets.length > 0; i++) {
        let bestTarget = null;
        let bestCrossings = Infinity;

        for (const target of possibleTargets) {
          const crossings = countLineCrossings(
            node.position,
            target.position,
            nodes
              .flatMap((n) =>
                n.connections.map((targetId) => {
                  const targetNode = nodes.find((tn) => tn.id === targetId);
                  return targetNode ? [n.position, targetNode.position] : null;
                })
              )
              .filter((line): line is [Point, Point] => line !== null)
          );

          if (crossings < bestCrossings) {
            bestCrossings = crossings;
            bestTarget = target;
          }
        }

        if (bestTarget) {
          node.connections.push(bestTarget.id);
          const targetIndex = possibleTargets.findIndex(
            (n) => n.id === bestTarget.id
          );
          possibleTargets.splice(targetIndex, 1);
        }
      }
    });
  }

  // New: Validate and fix connections
  const validateAndFixConnections = () => {
    // Check each node (except first layer) for incoming connections
    for (let layerIndex = 1; layerIndex < layers.length; layerIndex++) {
      const currentLayer = layers[layerIndex];

      currentLayer.forEach((node) => {
        const hasIncoming = nodes.some((n) => n.connections.includes(node.id));

        if (!hasIncoming) {
          // Find the best node from the previous layer to connect from
          const previousLayer = layers[layerIndex - 1];
          let bestSource = null;
          let bestCrossings = Infinity;

          for (const sourceNode of previousLayer) {
            const crossings = countLineCrossings(
              sourceNode.position,
              node.position,
              nodes
                .flatMap((n) =>
                  n.connections.map((targetId) => {
                    const targetNode = nodes.find((tn) => tn.id === targetId);
                    return targetNode
                      ? [n.position, targetNode.position]
                      : null;
                  })
                )
                .filter((line): line is [Point, Point] => line !== null)
            );

            if (crossings < bestCrossings) {
              bestCrossings = crossings;
              bestSource = sourceNode;
            }
          }

          if (bestSource) {
            bestSource.connections.push(node.id);
            console.log(
              `Fixed disconnected node ${node.id} by connecting from ${bestSource.id}`
            );
          }
        }
      });
    }
  };

  // New: Validate path to end exists
  const validatePathToEnd = () => {
    const lastLayer = layers[layers.length - 1];
    const reachableNodes = new Set<string>();

    // Start from first layer
    const queue = [...layers[0]];
    queue.forEach((node) => reachableNodes.add(node.id));

    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const targetId of current.connections) {
        if (!reachableNodes.has(targetId)) {
          reachableNodes.add(targetId);
          const targetNode = nodes.find((n) => n.id === targetId);
          if (targetNode) {
            queue.push(targetNode);
          }
        }
      }
    }

    // Check if all end nodes are reachable
    lastLayer.forEach((node) => {
      if (!reachableNodes.has(node.id)) {
        console.log(`End node ${node.id} not reachable, fixing...`);
        // Connect from the closest reachable node in previous layer
        const previousLayer = layers[layers.length - 2];
        const reachablePreviousNodes = previousLayer.filter((n) =>
          reachableNodes.has(n.id)
        );

        if (reachablePreviousNodes.length > 0) {
          const closestNode = reachablePreviousNodes.reduce((best, current) => {
            const currentDist = Math.abs(current.position.y - node.position.y);
            const bestDist = Math.abs(best.position.y - node.position.y);
            return currentDist < bestDist ? current : best;
          });
          closestNode.connections.push(node.id);
        }
      }
    });
  };

  // Run validations
  validateAndFixConnections();
  validatePathToEnd();

  return {
    nodes,
    currentLevel: level,
    startNodeId: layers[0][0].id,
    endNodeIds: layers[layers.length - 1].map((node) => node.id),
  };
};

// Helper function to count line crossings
const countLineCrossings = (
  start: Point,
  end: Point,
  existingLines: [Point, Point][]
): number => {
  let crossings = 0;

  for (const [lineStart, lineEnd] of existingLines) {
    if (doLinesIntersect(start, end, lineStart, lineEnd)) {
      crossings++;
    }
  }

  return crossings;
};

// Helper function to check if two line segments intersect
const doLinesIntersect = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): boolean => {
  const ccw = (A: Point, B: Point, C: Point) => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  };

  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
};

const getRandomNodeType = (): NodeType => {
  const types: NodeType[] = [
    "combat",
    "combat",
    "combat",
    "merchant",
    "treasure",
    "event",
  ];
  return types[Math.floor(Math.random() * types.length)];
};

// Game actions
export const completeNode = (
  gameState: GameState,
  nodeId: string
): GameState => {
  const newNodes = gameState.map.nodes.map((node) => {
    if (node.id === nodeId) {
      // Mark current node as completed
      return { ...node, completed: true, available: false };
    }

    // If this node has a connection from the completed node,
    // make it available. Otherwise, make it unavailable.
    const isConnectedFromCompletedNode = gameState.map.nodes
      .find((n) => n.id === nodeId)
      ?.connections.includes(node.id);

    return {
      ...node,
      available: isConnectedFromCompletedNode ?? false,
    };
  });

  return {
    ...gameState,
    map: {
      ...gameState.map,
      nodes: newNodes,
    },
    currentNodeId: nodeId,
  };
};

export const moveToNode = (gameState: GameState, nodeId: string): GameState => {
  if (!gameState.map.nodes.find((node) => node.id === nodeId)?.available) {
    throw new Error("Cannot move to unavailable node");
  }

  return {
    ...gameState,
    currentNodeId: nodeId,
  };
};
