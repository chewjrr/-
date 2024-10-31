import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './labyrinth.css';

function LabyrinthGame() {
  const [labyrinth, setLabyrinth] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 2], // Выход (красная клетка)
  ]);

  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

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
    if (newX >= 0 && newX < labyrinth.length && newY >= 0 && newY < labyrinth.length && labyrinth[newY][newX] !== 1) {
      setX(newX);
      setY(newY);
      const newLabyrinth = [...labyrinth];
      newLabyrinth[y][x] = 0;
      newLabyrinth[newY][newX] = 3;

      // Проверка на выход
      if (newLabyrinth[newY][newX] === 3 && labyrinth[newY][newX] === 2) {
        alert('Вы прошли лабиринт!');
      }

      setLabyrinth(newLabyrinth);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [x, y, labyrinth]);

  return (
    <div className="labyrinth-container">
      {labyrinth.map((row, rowIndex) => (
        <div key={rowIndex} className="labyrinth-row">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className={`labyrinth-cell ${cell === 1 ? 'wall' : cell === 3 ? 'object' : cell === 2 ? 'exit' : 'path'}`}>
              {cell === 3 && 'Куб'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LabyrinthGame;