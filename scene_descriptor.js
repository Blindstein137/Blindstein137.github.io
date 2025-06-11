// scene_descriptor.js
// Provides a descriptor with a triangle at origin and labeled unit axes

export function getSceneDescriptor() {
  return {
    primitives: {
      triangle: {
        vertices: [
          [0, 0],
          [1, 0],
          [0, 1]
        ]
      },
      xAxis: {
        from: [0, 0],
        to: [2, 0]
      },
      yAxis: {
        from: [0, 0],
        to: [0, 2]
      },
      xLabel: {
        text: 'x',
        font: '0.3px sans-serif'
      },
      yLabel: {
        text: 'y',
        font: '0.3px sans-serif'
      }
    },

    objects: [
      {
        shape: 'triangle',
        type: 'polygon',
        base: 'triangle',
        transform: ['identity'],
        style: { stroke: 'white', fill: 'transparent', lineWidth: 0.02 }
      },
      {
        shape: 'xAxis',
        type: 'line',
        base: 'xAxis',
        transform: ['identity'],
        style: { stroke: '#ccc', lineWidth: 0.01 }
      },
      {
        shape: 'yAxis',
        type: 'line',
        base: 'yAxis',
        transform: ['identity'],
        style: { stroke: '#ccc', lineWidth: 0.01 }
      },
      {
        shape: 'xLabel',
        type: 'text',
        base: 'xLabel',
        transform: ['translate', [2.1, 0]],
        style: { fill: '#ccc' }
      },
      {
        shape: 'yLabel',
        type: 'text',
        base: 'yLabel',
        transform: ['translate', [0, 2.1]],
        style: { fill: '#ccc' }
      }
    ]
  };
}
