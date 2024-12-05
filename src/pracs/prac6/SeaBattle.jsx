import React, { useState, useEffect } from 'react';
import './SeaBattle.css';

const GRID_SIZE = 10;
const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]; // Размеры кораблей

const createEmptyGrid = () =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

const SeaBattle = () => {
  const [playerGrid, setPlayerGrid] = useState(createEmptyGrid());
  const [computerGrid, setComputerGrid] = useState(createEmptyGrid());
  const [showComputerShips, setShowComputerShips] = useState(false);
  const [currentOrientation, setCurrentOrientation] = useState('horizontal');
  const [selectedShip, setSelectedShip] = useState(SHIPS[0]);
  const [placedShips, setPlacedShips] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    const gridWithShips = placeShipsRandomly(createEmptyGrid());
    setComputerGrid(gridWithShips);
  }, []);

  const toggleOrientation = () => {
    setCurrentOrientation(currentOrientation === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const placeShipsRandomly = (grid) => {
    const newGrid = [...grid.map((row) => [...row])];
    for (const ship of SHIPS) {
      let placed = false;
      while (!placed) {
        const startX = Math.floor(Math.random() * GRID_SIZE);
        const startY = Math.floor(Math.random() * GRID_SIZE);
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

        if (canPlaceShip(newGrid, startX, startY, ship, direction)) {
          placeShip(newGrid, startX, startY, ship, direction);
          placed = true;
        }
      }
    }
    return newGrid;
  };

  const canPlaceShip = (grid, x, y, size, direction) => {
    for (let i = 0; i < size; i++) {
      const newX = direction === 'horizontal' ? x + i : x;
      const newY = direction === 'vertical' ? y + i : y;

      // Проверка на выход за границы и занятость клетки
      if (
        newX < 0 ||
        newX >= GRID_SIZE ||
        newY < 0 ||
        newY >= GRID_SIZE ||
        grid[newY][newX] !== null
      ) {
        return false;
      }
    }
    return true;
  };

  const placeShip = (grid, x, y, size, direction) => {
    for (let i = 0; i < size; i++) {
      const newX = direction === 'horizontal' ? x + i : x;
      const newY = direction === 'vertical' ? y + i : y;
      grid[newY][newX] = 'S'; // Обозначаем клетку кораблем
    }
  };

  const handleCellClick = (x, y) => {
    if (isGameStarted) return;

    // Копируем текущую сетку игрока
    const gridCopy = [...playerGrid.map((row) => [...row])];

    // Проверяем возможность размещения корабля
    if (canPlaceShip(gridCopy, x, y, selectedShip, currentOrientation)) {
      // Размещаем корабль
      placeShip(gridCopy, x, y, selectedShip, currentOrientation);
      setPlayerGrid(gridCopy);

      // Добавляем корабль в список размещенных
      setPlacedShips((prevShips) => [...prevShips, selectedShip]);

      // Переход к следующему кораблю
      const nextShipIndex = placedShips.length + 1;
      if (nextShipIndex < SHIPS.length) {
        setSelectedShip(SHIPS[nextShipIndex]);
      } else {
        setSelectedShip(null); // Все корабли размещены
      }
    } else {
      alert('Cannot place ship here!');
    }
  };

  const startGame = () => {
    const totalShipCells = SHIPS.reduce((acc, size) => acc + size, 0);
    const placedShipCells = placedShips.reduce((acc, size) => acc + size, 0);

    if (placedShipCells === totalShipCells) {
      setIsGameStarted(true);
    } else {
      alert('Place all ships before starting the game!');
    }
  };

  const checkGameOver = () => {
    const playerShipsLeft = playerGrid.flat().filter((cell) => cell === 'S').length;
    const computerShipsLeft = computerGrid.flat().filter((cell) => cell === 'S').length;

    if (playerShipsLeft === 0) {
      alert('Game over! Computer wins!');
      setIsGameStarted(false);
    } else if (computerShipsLeft === 0) {
      alert('Congratulations! You win!');
      setIsGameStarted(false);
    }
  };

  useEffect(() => {
    if (isGameStarted) checkGameOver();
  }, [playerGrid, computerGrid]);

  return (
    <div className="sea-battle">
      <h1>Sea Battle</h1>
      <div className="grids">
        <div className="grid">
          <h3>Player</h3>
          {playerGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${cell === 'S' ? 'ship' : cell === 'X' ? 'hit' : ''}`}
                  onClick={() => handleCellClick(colIndex, rowIndex)} // Только для игрока
                />
              ))}
            </div>
          ))}
        </div>
        <div className="grid">
          <h3>Computer</h3>
          {computerGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${
                    showComputerShips && cell === 'S'
                      ? 'computer-ship'
                      : cell === 'X'
                      ? 'hit'
                      : ''
                  }`}
                  onClick={null} // Убираем клики по компьютеру
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <p>Current Ship Size: {selectedShip || 'All ships placed!'}</p>
        <button onClick={toggleOrientation}>
          Toggle Orientation: {currentOrientation}
        </button>
        <button onClick={startGame}>Start Game</button>
        <button onClick={() => setShowComputerShips(!showComputerShips)}>
          {showComputerShips ? 'Hide Computer Ships' : 'Show Computer Ships'}
        </button>
      </div>
    </div>
  );
};

export default SeaBattle;
