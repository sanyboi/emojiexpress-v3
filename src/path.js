const levelData = {
  1: {
    // Level 1 uses generateSpiral(), so we can leave this empty or add points
    path: [], 
    shooterPos: { x: 0.5, y: 0.5 }
  },
  2: {
    path: [
      { x: 0.1, y: 0.1 }, // Start: Top Left
      { x: 0.9, y: 0.1 }, // Across to Top Right
      { x: 0.9, y: 0.4 }, // Down slightly
      { x: 0.1, y: 0.6 }, // Diagonal to Middle Left
      { x: 0.1, y: 0.9 }, // Down to Bottom Left
      { x: 0.9, y: 0.9 }  // Finish: Bottom Right
    ],
    shooterPos: { x: 0.1, y: 0.5 } // Phone stays in the center
  }
};