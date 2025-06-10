// scene_descriptor.js
// Defines primitives and scene setup including axes, ticks, labels, and a base triangle

export function getSceneDescriptor() {
  const primitives = {
    triangle: {
      type: "polygon",
      vertices: [
        [0, 0],
        [1, 0],
        [0, 1]
      ]
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
    label: {
      type: "text",
      text: "x",
      font: "12px sans-serif"
    }
  };

  const objects = [
    // Axes
    { shape: "line", transform: ["scale", [6, 1]], style: { stroke: "gray" } },
    { shape: "line", transform: ["rotate", Math.PI / 2, "scale", [6, 1]], style: { stroke: "gray" } },

    // Ticks X
    ...Array.from({ length: 7 }, (_, i) => ({
      shape: "tick",
      transform: ["translate", [i, 0]],
      style: { stroke: "gray" }
    })),

    // Ticks Y
    ...Array.from({ length: 7 }, (_, i) => ({
      shape: "tick",
      transform: ["rotate", Math.PI / 2, "translate", [0, i]],
      style: { stroke: "gray" }
    })),

    // Labels
    { shape: "label", transform: ["translate", [6.5, -0.3]], style: { fill: "gray" } },
    { shape: "label", transform: ["translate", [-0.3, 6.5]], style: { fill: "gray" }, textOverride: "y" },

    // Base triangle (unit leg)
    { shape: "triangle", transform: [], style: { stroke: "white", fill: "transparent", lineWidth: 2 } }
  ];

  return {
    canvas: {
      width: 800,
      height: 600,
      background: "#111"
    },
    primitives,
    objects
  };
}
