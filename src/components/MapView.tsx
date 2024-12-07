import { motion, Point, useMotionValue } from "framer-motion";
import { Shield, Store, Gem, Star, HelpCircle } from "lucide-react";
import type { MapNode, GameState } from "../types";

interface MapViewProps {
  gameState: GameState;
  onNodeClick: (nodeId: string) => void;
}

const MapView = ({ gameState, onNodeClick }: MapViewProps) => {
  // Constants for node styling
  const NODE_RADIUS = 24;
  const NODE_PADDING = 1;
  const ICON_SIZE = 20;

  const x = useMotionValue(0);

  // Icons for different node types
  const NodeIcons = {
    combat: Shield,
    merchant: Store,
    treasure: Gem,
    event: HelpCircle,
    boss: Star,
  };

  // Colors for different node states
  const nodeColors = {
    available: {
      fill: "white",
      stroke: "#2196F3",
      iconColor: "#2196F3",
    },
    completed: {
      fill: "#4CAF50",
      stroke: "#45a049",
      iconColor: "white",
    },
    unavailable: {
      fill: "#e0e0e0",
      stroke: "#bdbdbd",
      iconColor: "#9e9e9e",
    },
    current: {
      fill: "#2196F3",
      stroke: "#1976D2",
      iconColor: "white",
    },
  };

  // Helper to get node status colors
  const getNodeColors = (node: MapNode) => {
    if (node.id === gameState.currentNodeId) return nodeColors.current;
    if (node.completed) return nodeColors.completed;
    if (node.available) return nodeColors.available;
    return nodeColors.unavailable;
  };

  // Render connections between nodes
  const calculateAvoidingPath = (
    start: Point,
    end: Point,
    nodesToAvoid: MapNode[]
  ): string => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Find any nodes that might intersect with a straight line between points
    const intersectingNodes = nodesToAvoid.filter((node) => {
      if (
        node.position.x <= Math.min(start.x, end.x) ||
        node.position.x >= Math.max(start.x, end.x)
      ) {
        return false;
      }

      // Calculate distance from point to line
      const t =
        ((node.position.x - start.x) * dx + (node.position.y - start.y) * dy) /
        (distance * distance);

      if (t < 0 || t > 1) return false;

      const projection = {
        x: start.x + t * dx,
        y: start.y + t * dy,
      };

      const nodeDistance = Math.sqrt(
        Math.pow(node.position.x - projection.x, 2) +
          Math.pow(node.position.y - projection.y, 2)
      );

      return nodeDistance < NODE_RADIUS + NODE_PADDING;
    });

    if (intersectingNodes.length === 0) {
      // If no intersections, use a simple curve
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const curveOffset = distance * 0.2;
      return `M ${start.x} ${start.y} 
              Q ${midX} ${midY + curveOffset} 
              ${end.x} ${end.y}`;
    }

    // For paths with intersecting nodes, calculate avoidance points
    const avgY =
      intersectingNodes.reduce((sum, node) => sum + node.position.y, 0) /
      intersectingNodes.length;

    // Determine if we should route above or below interfering nodes
    const shouldRouteAbove = avgY > (start.y + end.y) / 2;
    const maxDeflection = Math.max(
      ...intersectingNodes.map((node) =>
        Math.abs(node.position.y - (start.y + end.y) / 2)
      )
    );

    // Create control points that route around the nodes
    const deflection = (NODE_RADIUS + NODE_PADDING) * 2 + maxDeflection;
    const cp1x = start.x + dx * 0.25;
    const cp2x = start.x + dx * 0.75;
    const cpY = shouldRouteAbove
      ? Math.min(start.y, end.y) - deflection
      : Math.max(start.y, end.y) + deflection;

    return `M ${start.x} ${start.y} 
            C ${cp1x} ${start.y} 
              ${cp1x} ${cpY} 
              ${(start.x + end.x) / 2} ${cpY} 
              ${cp2x} ${cpY} 
              ${cp2x} ${end.y}
              ${end.x} ${end.y}`;
  };

  // Render connections between nodes with avoidance
  const renderConnections = () => (
    <g className="connections">
      {gameState.map.nodes.map((node) =>
        node.connections.map((targetId) => {
          const targetNode = gameState.map.nodes.find((n) => n.id === targetId);
          if (!targetNode) return null;

          // Get all nodes except source and target to check for intersections
          const otherNodes = gameState.map.nodes.filter(
            (n) => n.id !== node.id && n.id !== targetId
          );

          const pathD = calculateAvoidingPath(
            node.position,
            targetNode.position,
            otherNodes
          );

          const isCurrent = gameState.currentNodeId === node.id;
          const targetAvailable = isCurrent && targetNode.available;
          const targetCompleted = node.completed && targetNode.completed;
          const getConnectionStroke = () => {
            if (targetAvailable) {
              return nodeColors.available.stroke;
            }
            if (targetCompleted) {
              return nodeColors.completed.stroke;
            }
            return "#e0e0e0";
          };

          return (
            <motion.path
              key={`${node.id}-${targetId}`}
              d={pathD}
              stroke={getConnectionStroke()}
              strokeWidth={3}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        })
      )}
    </g>
  );

  // Render individual nodes
  const renderNode = (node: MapNode) => {
    const Icon = NodeIcons[node.type];
    const colors = getNodeColors(node);

    return (
      <motion.g
        key={node.id}
        className="node-group"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={node.available ? { scale: 1.1 } : {}}
        onClick={() => node.available && onNodeClick(node.id)}
        style={{ cursor: node.available ? "pointer" : "default" }}
      >
        {/* Node highlight effect */}
        {node.available && !node.completed && (
          <motion.circle
            cx={node.position.x}
            cy={node.position.y}
            r={NODE_RADIUS + 4}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2"
            opacity="0.5"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Main node circle */}
        <circle
          cx={node.position.x}
          cy={node.position.y}
          r={NODE_RADIUS}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="3"
        />

        {/* Node icon */}
        <foreignObject
          x={node.position.x - ICON_SIZE / 2}
          y={node.position.y - ICON_SIZE / 2}
          width={ICON_SIZE}
          height={ICON_SIZE}
        >
          <div className="h-full w-full flex items-center justify-center">
            <Icon className="w-full h-full" color={colors.iconColor} />
          </div>
        </foreignObject>

        {/* Node label */}
        <text
          x={node.position.x}
          y={node.position.y + NODE_RADIUS + 16}
          textAnchor="middle"
          className="text-sm fill-current"
          style={{ pointerEvents: "none" }}
        >
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
        </text>
      </motion.g>
    );
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-gray-50 rounded-lg p-4 cursor-grab active:cursor-grabbing overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: -400, right: 400 }}
        style={{ x }}
        className="w-full h-full"
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {renderConnections()}
          {gameState.map.nodes.map(renderNode)}
        </svg>
      </motion.div>
    </div>
  );
};

export default MapView;
