const triQuadPoints = (size, top) => {
  return [
    {
      pts: [
        [0, 0], // top left
        [size, 0], // top right
        [0, size], // bottom left
      ],
      depth: 3,
    },
    {
      pts: [
        [size, size], // bottom right
        [0, size], // bottom left
        [size, 0], // top right
      ],
      depth: 3,
    },
  ];
};

exports.triQuadPoints = triQuadPoints;
