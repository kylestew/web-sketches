const triQuadPoints = (size, top) => {
  return [
    {
      pts: [
        [0, 0], // top left
        [size, 0], // top right
        [0, size], // bottom left
      ],
      depth: 2,
    },
    {
      pts: [
        [size, size], // bottom right
        [0, size], // bottom left
        [size, 0], // top right
      ],
      depth: 2,
    },
  ];
};

exports.triQuadPoints = triQuadPoints;
