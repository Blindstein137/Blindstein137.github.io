// sceneDescriptor.js
// Modular scene descriptor for June 6 matrix transformation task
// Designed for extensibility, modularity, and composition chaining

// Primitive shape definitions (positioned fully in 1st quadrant by default)
const primitives = {
  circle: {
    type: "circle",
    radius: 1,
    center: [1, 1] // ensures the full unit-radius circle sits in (+,+) quadrant
  },
  square: {
    type: "polygon",
    vertices: [
      [0, 0], [1, 0], [1, 1], [0, 1] // bottom-left anchored unit square in 1st quadrant
    ]
  },
  triangle: {
    type: "polygon",
    vertices: [
      [0.5, 1], [0, 0], [1, 0] // upright triangle resting in 1st quadrant
    ]
  },
  spiral: {
    type: "curve",
    parametric: {
      x: "t * Math.cos(t)",
      y: "t * Math.sin(t)",
      tmin: 0,
      tmax: 4 * Math.PI,
      steps: 100
    }
  },
  label: {
    type: "text",
    text: "Origin",
    font: "14px sans-serif"
  },
  line: {
    type: "line",
    from: [0, 0],
    to: [1, 0]
  },
  tick: {
    type: "line",
    from: [0, -0.1],
    to: [0, 0.1]
  },
  axisLabel: {
    type: "text",
    text: "x",
    font: "12px sans-serif"
  }
};

// Instances to draw in the scene
const objects = [
  // Axes
  {
    shape: "line", // X axis
    transform: ["scale", [5, 1], "translate", [0, 0]],
    style: { stroke: "gray" }
  },
  {
    shape: "line", // Y axis (rotated X axis)
    transform: ["rotate", 90, "scale", [5, 1], "translate", [0, 0]],
    style: { stroke: "gray" }
  },

  // Tick marks on X axis
  ...Array.from({ length: 6 }, (_, i) => ({
    shape: "tick",
    transform: ["translate", [i, 0]],
    style: { stroke: "gray" }
  })),

  // Tick marks on Y axis
  ...Array.from({ length: 6 }, (_, i) => ({
    shape: "tick",
    transform: ["rotate", 90, "translate", [0, i]],
    style: { stroke: "gray" }
  })),

  // Axis labels
  {
    shape: "axisLabel",
    transform: ["translate", [5.5, -0.3]],
    style: { fill: "gray" }
  },
  {
    shape: "axisLabel",
    transform: ["translate", [-0.3, 5.5]],
    style: { fill: "gray" },
    textOverride: "y"
  },

  // Geometry
  {
    shape: "circle",
    transform: ["translate", [0, 0]],
    style: { stroke: "#00ffff", fill: "#003333" }
  },
  {
    shape: "square",
    transform: ["translate", [2, 0]],
    style: { stroke: "white", fill: "#555555" }
  },
  {
    shape: "triangle",
    transform: ["translate", [0, 2]],
    style: { stroke: "orange", fill: "transparent" }
  },
  {
    shape: "spiral",
    transform: ["scale", [0.2, 0.2], "translate", [4, 1]],
    style: { stroke: "purple", fill: "none" }
  },
  {
    shape: "label",
    transform: ["translate", [0, 0]],
    style: { fill: "white" }
  }
];

// Global canvas metadata (optional for descriptor chaining)
const canvasSettings = {
  width: 800,
  height: 600,
  background: "#111111"
};

// Exported descriptor package
export function getSceneDescriptor() {
  return {
    canvas: canvasSettings,
    primitives,
    objects
  };
}
