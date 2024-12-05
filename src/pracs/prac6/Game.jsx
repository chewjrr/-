import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';

class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        return this.hits >= this.length;
    }
}

class Player {
    constructor(size) {
        this.size = size;
        this.board = this.createBoard();
        this.ships = this.placeShips();
    }

    createBoard() {
        const board = [];
        for (let i = 0; i < this.size; i++) {
            board[i] = [];
            for (let j = 0; j < this.size; j++) {
                board[i][j] = null;
            }
        }
        return board;
    }

    placeShips() {
        const ships = [
            new Ship(4),
            new Ship(3),
            new Ship(3),
            new Ship(2),
            new Ship(2),
            new Ship(2),
            new Ship(1),
            new Ship(1),
            new Ship(1),
            new Ship(1)
        ];

        ships.forEach(ship => {
            let placed = false;
            while (!placed) {
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                const row = Math.floor(Math.random() * this.size);
                const col = Math.floor(Math.random() * this.size);
                if (this.canPlaceShip(row, col, direction, ship.length)) {
                    this.placeShip(row, col, direction, ship);
                    placed = true;
                }
            }
        });

        return ships;
    }

    canPlaceShip(row, col, direction, length) {
        if (direction === 'horizontal') {
            if (col + length > this.size) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[row][col + i] !== null) return false;
            }
        } else {
            if (row + length > this.size) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[row + i][col] !== null) return false;
            }
        }
        return true;
    }

    placeShip(row, col, direction, ship) {
        if (direction === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                this.board[row][col + i] = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.board[row + i][col] = ship;
            }
        }
    }

    receiveAttack(row, col) {
        const cell = this.board[row][col];
        if (cell) {
            cell.hit();
            return true;
        }
        return false;
    }
}

const Game = () => {
    const [playerBoard, setPlayerBoard] = useState(Array(10).fill().map(() => Array(10).fill(null)));
    const [computerBoard, setComputerBoard] = useState(Array(10).fill().map(() => Array(10).fill(null)));
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const player = new Player(10);
        const computer = new Player(10);
        setPlayerBoard(player.board.map(row => row.map(cell => (cell ? 'ship' : null))));
        setComputerBoard(computer.board.map(row => row.map(cell => (cell ? 'ship' : null))));
    }, []);

    const handleClick = (row, col) => {
        if (gameOver) return;

        const newComputerBoard = computerBoard.map(row => row.slice());
        const hit = newComputerBoard[row][col] === 'ship';
        newComputerBoard[row][col] = hit ? 'hit' : 'miss';
        setComputerBoard(newComputerBoard);

        if (hit) {
            // Check if all ships are sunk
            const allSunk = newComputerBoard.every(row => row.every(cell => cell !== 'ship'));
            if (allSunk) {
                setGameOver(true);
                setWinner('Player');
                return;
            }
        }

        // Computer's turn
        let computerRow, computerCol;
        do {
            computerRow = Math.floor(Math.random() * 10);
            computerCol = Math.floor(Math.random() * 10);
        } while (playerBoard[computerRow][computerCol] === 'hit' || playerBoard[computerRow][computerCol] === 'miss');

        const newPlayerBoard = playerBoard.map(row => row.slice());
        const computerHit = newPlayerBoard[computerRow][computerCol] === 'ship';
        newPlayerBoard[computerRow][computerCol] = computerHit ? 'hit' : 'miss';
        setPlayerBoard(newPlayerBoard);

        if (computerHit) {
            // Check if all ships are sunk
            const allSunk = newPlayerBoard.every(row => row.every(cell => cell !== 'ship'));
            if (allSunk) {
                setGameOver(true);
                setWinner('Computer');
            }
        }
    };

    return (
        <div>
            <h1>Морской бой</h1>
            <div>
                <h2>Игрок</h2>
                <GameBoard board={playerBoard} onClick={() => {}} />
            </div>
            <div>
                <h2>Компьютер</h2>
                <GameBoard board={computerBoard} onClick={handleClick} />
            </div>
            {gameOver && <h2>{winner} победил!</h2>}
        </div>
    );
};

export default Game;
