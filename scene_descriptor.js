// DevTrack Phase Checklist
// ==========================
// PHASES:
// ✅ Phase 1: Button functionality + matrix display
// ✅ descriptor.html
// ✅ matrix.js
// ✅ scene_draw.js
// ✅ scene_descriptor.js
// ✅ read.js
//
// ⏳ Phase 2: Y-axis label upright
// ✅ descriptor.html
// ✅ matrix.js
// ✅ scene_draw.js
// ✅ scene_descriptor.js ← [YOU ARE HERE]
// ⬜ read.js
//
// ⬜ Phase 3: Axes extend to viewport limits
// ⬜ descriptor.html
// ⬜ matrix.js
// ⬜ scene_draw.js
// ⬜ scene_descriptor.js
// ⬜ read.js
//
// FILE ORDER (Round-Robin):
// 1. descriptor.html
// 2. matrix.js
// 3. scene_draw.js
// 4. scene_descriptor.js ✅
// 5. read.js

// scene_descriptor.js
// Defines initial primitives and scene layout

export function getSceneDescriptor() {
  return {
    primitives: {
      xAxis: {
        type: "line",
        from: [-10, 0],
        to: [10, 0],
      },
      yAxis: {
        type: "line",
        from: [0, -10],
        to: [0, 10],
      },
      xLabel: {
        type: "text",
        text: "x",
        font: "14px sans-serif"
      },
      yLabel: {
        type: "text",
        text: "y",
        font: "14px sans-serif"
      },
      triangle: {
        type: "polygon",
        vertices: [[0, 0], [1, 0], [0, 1]],
      }
    },

    objects: [
      { base: "xAxis", transform: ["identity"], style: { stroke: "white", lineWidth: 0.04 } },
      { base: "yAxis", transform: ["identity"], style: { stroke: "white", lineWidth: 0.04 } },
      { base: "xLabel", transform: ["translate", [10.2, 0]], style: { fill: "white" } },
      { base: "yLabel", transform: ["translate", [0, 10.2]], style: { fill: "white" } },  // <-- FIXED LABEL ORIENTATION
      {
        base: "triangle",
        transform: ["identity"],
        style: {
          fill: "rgba(0, 128, 255, 0.4)",
          stroke: "cyan",
          lineWidth: 0.05,
        },
        shape: "triangle",
      }
    ]
  };
}
