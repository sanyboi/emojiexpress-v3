const levelData = {
  1: { // SPIRAL (Automatic)
    path: [], 
    shooterPos: { x: 0.5, y: 0.5 }
  },
  2: { // THE Z-SHAPE (Intro to Corners)
    path: [
      { x: 0.1, y: 0.2 }, { x: 0.9, y: 0.2 }, 
      { x: 0.1, y: 0.8 }, { x: 0.9, y: 0.8 }
    ],
    shooterPos: { x: 0.1, y: 0.5 }
  },
  3: { // THE WAVES (Curvy flow)
    path: [
      { x: 0.1, y: 0.5 }, { x: 0.3, y: 0.2 }, 
      { x: 0.5, y: 0.8 }, { x: 0.7, y: 0.2 }, { x: 0.9, y: 0.5 }
    ],
    shooterPos: { x: 0.5, y: 0.5 }
  },
  4: { // THE SQUARE BOX (Outer Edge)
    path: [
      { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 }, 
      { x: 0.9, y: 0.9 }, { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.2 }
    ],
    shooterPos: { x: 0.5, y: 0.5 }
  },
  5: { // THE HOURGLASS
    path: [
      { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 }, 
      { x: 0.1, y: 0.9 }, { x: 0.9, y: 0.9 }
    ],
    shooterPos: { x: 0.5, y: 0.5 }
  },
  6: { // THE SNAKE (Multiple tight turns)
    path: [
      { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 }, 
      { x: 0.9, y: 0.3 }, { x: 0.1, y: 0.3 }, 
      { x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 },
      { x: 0.9, y: 0.7 }, { x: 0.1, y: 0.7 }
    ],
    shooterPos: { x: 0.5, y: 0.9 } // Phone at the bottom
  },
  7: { // THE TRIANGLE
    path: [
      { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.8 }, 
      { x: 0.1, y: 0.8 }, { x: 0.5, y: 0.1 }
    ],
    shooterPos: { x: 0.5, y: 0.45 }
  },
  8: { // THE DIAMOND
    path: [
      { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.5 }, 
      { x: 0.5, y: 0.9 }, { x: 0.1, y: 0.5 }, { x: 0.5, y: 0.1 }
    ],
    shooterPos: { x: 0.5, y: 0.5 }
  },
  9: { // THE U-TURN (Long and winding)
    path: [
      { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.8 }, 
      { x: 0.8, y: 0.8 }, { x: 0.8, y: 0.1 },
      { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.6 }
    ],
    shooterPos: { x: 0.1, y: 0.1 } // Corner shooter
  },
  10: { // THE SPIRAL SQUARE (Difficult)
    path: [
      { x: 0.05, y: 0.05 }, { x: 0.95, y: 0.05 }, 
      { x: 0.95, y: 0.95 }, { x: 0.05, y: 0.95 },
      { x: 0.05, y: 0.2 }, { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }
    ],
    shooterPos: { x: 0.5, y: 0.5 }
  }
};