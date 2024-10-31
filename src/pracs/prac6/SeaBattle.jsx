import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import './SeaBattle.css';

const BOARD_SIZE = 10;

// Типы кораблей и их размеры
const SHIPS = [
  { name: 'Линкор', size: 4, count: 1 },
  { name: 'Крейсер', size: 3, count: 2 },
  { name: 'Эсминец', size: 2, count: 3 },
  { name: 'Катер', size: 1, count: 4 }
];

// Инициализация пустого поля
const initBoard = () =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

const SeaBattle = () => {
  const [playerBoard, setPlayerBoard] = useState(initBoard());
  const [computerBoard, setComputerBoard] = useState(initBoard());
  const [playerTurn, setPlayerTurn] = useState(true);
  const [placingShip, setPlacingShip] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    placeShips(computerBoard, setComputerBoard);
  }, []);

  // Функция для размещения кораблей компьютера
  const placeShips = (board, setBoard) => {
    const newBoard = [...board];
    for (let ship of SHIPS) {
      for (let i = 0; i < ship.count; i++) {
        let placed = false;
        while (!placed) {
          const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
          const x = Math.floor(Math.random() * BOARD_SIZE);
          const y = Math.floor(Math.random() * BOARD_SIZE);

          // Проверка, можно ли разместить корабль
          if (canPlaceShip(newBoard, x, y, ship.size, direction)) {
            for (let j = 0; j < ship.size; j++) {
              const xi = direction === 'horizontal' ? x : x + j;
              const yi = direction === 'horizontal' ? y + j : y;
              newBoard[xi][yi] = 'S';
            }
            placed = true;
          }
        }
      }
    }
    setBoard(newBoard);
  };

  // Проверка, можно ли разместить корабль
  const canPlaceShip = (board, x, y, size, direction) => {
    for (let i = 0; i < size; i++) {
      const xi = direction === 'horizontal' ? x : x + i;
      const yi = direction === 'horizontal' ? y + i : y;

      if (
        xi >= BOARD_SIZE ||
        yi >= BOARD_SIZE ||
        board[xi][yi] === 'S' ||
        isAdjacentOccupied(board, xi, yi)
      ) {
        return false;
      }
    }
    return true;
  };

  // Проверка, что рядом с ячейкой нет других кораблей
  const isAdjacentOccupied = (board, x, y) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const xi = x + i;
        const yj = y + j;
        if (
          xi >= 0 &&
          xi < BOARD_SIZE &&
          yj >= 0 &&
          yj < BOARD_SIZE &&
          board[xi][yj] === 'S'
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Установка кораблей игроком
  const handleCellClick = (x, y) => {
    if (placingShip) {
      const { size } = placingShip;
      const direction = 'horizontal'; // можно добавить выбор направления
      if (canPlaceShip(playerBoard, x, y, size, direction)) {
        const newBoard = [...playerBoard];
        for (let i = 0; i < size; i++) {
          const xi = direction === 'horizontal' ? x : x + i;
          const yi = direction === 'horizontal' ? y + i : y;
          newBoard[xi][yi] = 'S';
        }
        setPlayerBoard(newBoard);
        setPlacingShip(null);
      }
    }
  };

  // Функция для размещения корабля игроком
  const selectShipToPlace = (ship) => {
    setPlacingShip(ship);
  };

  // Проверка завершения игры
  const checkGameOver = (board, currentPlayer) => {
    const allShipsSunk = board.every(row => row.every(cell => cell !== 'S'));
    if (allShipsSunk) {
      setGameOver(true);
      setWinner(currentPlayer);
    }
  };

  // Отображение клеток
  const renderCell = (cell, x, y, isPlayerBoard) => (
    <div
      className={`cell ${cell === 'S' ? (isPlayerBoard ? 'player-ship' : 'computer-ship') : ''} ${
        cell === 'X' ? 'hit' : cell === 'O' ? 'miss' : ''
      }`}
      onClick={() => isPlayerBoard && handleCellClick(x, y)}
    >
      {cell}
    </div>
  );

  return (
    <Container>
      <Row>
        <Col>
          <h3>Ваше поле</h3>
          <div className="board">
            {playerBoard.map((row, x) => (
              <div className="row" key={x}>
                {row.map((cell, y) => renderCell(cell, x, y, true))}
              </div>
            ))}
          </div>
          <div>
            {SHIPS.map((ship, index) => (
              <button key={index} onClick={() => selectShipToPlace(ship)}>
                {ship.name} ({ship.size})
              </button>
            ))}
          </div>
        </Col>
        <Col>
          <h3>Поле компьютера</h3>
          <div className="board">
            {computerBoard.map((row, x) => (
              <div className="row" key={x}>
                {row.map((cell, y) => renderCell(cell, x, y, false))}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      {gameOver ? (
        <Alert variant="success">
          Игра окончена! Победитель: {winner}
        </Alert>
      ) : (
        <Alert variant="info">Ходит: {playerTurn ? 'Игрок' : 'Компьютер'}</Alert>
      )}
    </Container>
  );
};

export default SeaBattle;
