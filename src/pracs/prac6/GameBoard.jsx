import React from 'react';
import './GameBoard.css';

const GameBoard = ({ board, onClick }) => {
    return (
        <table>
            <tbody>
                {board.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td
                                key={colIndex}
                                className={cell}
                                onClick={() => onClick(rowIndex, colIndex)}
                            ></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GameBoard;
