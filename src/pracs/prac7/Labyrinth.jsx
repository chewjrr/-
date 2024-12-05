import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './labyrinth.css';

function LabyrinthGame() {
  const initialLabyrinth = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 4, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 6, 0, 1],
    [1, 0, 0, 0, 1, 5, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 2], // Выход (красная клетка)
  ];

  const [labyrinth, setLabyrinth] = useState(initialLabyrinth);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const [path, setPath] = useState([]);

  const handleKeyPress = (event) => {
    let newX = x;
    let newY = y;

    switch (event.key) {
      case 'ArrowUp':
        newY -= 1;
        break;
      case 'ArrowDown':
        newY += 1;
        break;
      case 'ArrowLeft':
        newX -= 1;
        break;
      case 'ArrowRight':
        newX += 1;
        break;
      default:
        return;
    }

    // Проверка валидности движения
    if (newX >= 0 && newX < labyrinth[0].length && newY >= 0 && newY < labyrinth.length) {
      const cellValue = labyrinth[newY][newX];

      if (cellValue === 1) {
        return;
      } else if (cellValue === 4) {
        alert('Вы уничтожены!');
        resetGame();
        return;
      } else if (cellValue === 5) {
        teleport(6);
        return;
      } else if (cellValue === 6) {
        teleport(5);
        return;
      }

      setX(newX);
      setY(newY);
      const newLabyrinth = labyrinth.map(row => row.slice());
      newLabyrinth[y][x] = 0;
      newLabyrinth[newY][newX] = 3;

      // Проверка на выход
      if (cellValue === 2) {
        alert('Вы прошли лабиринт!');
      }

      setLabyrinth(newLabyrinth);
    }
  };

  const resetGame = () => {
    setX(1);
    setY(1);
    setLabyrinth(initialLabyrinth);
    setPath([]);
  };

  const teleport = (targetValue) => {
    const newLabyrinth = labyrinth.map(row => row.slice());
    for (let i = 0; i < newLabyrinth.length; i++) {
      for (let j = 0; j < newLabyrinth[i].length; j++) {
        if (newLabyrinth[i][j] === targetValue) {
          newLabyrinth[y][x] = 0;
          newLabyrinth[i][j] = 3;
          setX(j);
          setY(i);
          setLabyrinth(newLabyrinth);
          return;
        }
      }
    }
  };

  const findPath = () => {
    const queue = [[y, x, []]];
    const visited = new Set();
    visited.add(`${y},${x}`);

    while (queue.length > 0) {
      const [currentY, currentX, currentPath] = queue.shift();

      if (labyrinth[currentY][currentX] === 2) {
        setPath(currentPath);
        return;
      }

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dy, dx] of directions) {
        const newY = currentY + dy;
        const newX = currentX + dx;
        const key = `${newY},${newX}`;

        if (
          newY >= 0 &&
          newY < labyrinth.length &&
          newX >= 0 &&
          newX < labyrinth[0].length &&
          !visited.has(key)
        ) {
          const cellValue = labyrinth[newY][newX];
          if (cellValue !== 1 && cellValue !== 4) {
            visited.add(key);
            queue.push([newY, newX, [...currentPath, [newY, newX]]]);
          } else if (cellValue === 5 || cellValue === 6) {
            const teleportTarget = cellValue === 5 ? 6 : 5;
            for (let i = 0; i < labyrinth.length; i++) {
              for (let j = 0; j < labyrinth[i].length; j++) {
                if (labyrinth[i][j] === teleportTarget) {
                  visited.add(key);
                  queue.push([i, j, [...currentPath, [newY, newX], [i, j]]]);
                }
              }
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [x, y, labyrinth]);

  return (
    <div>
      <button onClick={findPath}>Построить маршрут</button>
      <div className="labyrinth-container">
        {labyrinth.map((row, rowIndex) => (
          <div key={rowIndex} className="labyrinth-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`labyrinth-cell ${
                  cell === 1
                    ? 'wall'
                    : cell === 3
                    ? 'object'
                    : cell === 2
                    ? 'exit'
                    : cell === 4
                    ? 'destroy'
                    : cell === 5 || cell === 6
                    ? 'teleport'
                    : 'path'
                } ${path.some(([py, px]) => py === rowIndex && px === cellIndex) ? 'path-highlight' : ''}`}
              >
                {cell === 3 && 'Куб'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LabyrinthGame;
