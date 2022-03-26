const triQuadPoints = (size, top) => {
  return [
    {
      pts: [
        [0, 0], // top left
        [size, 0], // top right
        [0, size], // bottom left
      ],
      strokeStyle: `#000000`,
      depth: 1,
    },
    {
      pts: [
        [size, size], // bottom right
        [0, size], // bottom left
        [size, 0], // top right
      ],
      strokeStyle: `#000000`,
      depth: 1,
    },
  ];
};

exports.triQuadPoints = triQuadPoints;
