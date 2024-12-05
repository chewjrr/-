// src/Race.js
import React, { useState, useEffect } from 'react';
import './Race.css';

const characters = ['🐢', '🐇', '🐉', '🐎', '🐕'];

const Race = () => {
    const [positions, setPositions] = useState([]);
    const [raceOver, setRaceOver] = useState(false);
    const [isRacing, setIsRacing] = useState(false);
    const totalLaps = 5;
    const trackDiameter = 400; // Диаметр трека в пикселях
    const radius = trackDiameter / 2; // Радиус круга

    useEffect(() => {
        if (isRacing) {
            // Инициализация позиций
            const initialPositions = Array.from({ length: characters.length }, () => 0);
            setPositions(initialPositions);

            // Запуск гонки
            const interval = setInterval(() => {
                if (!raceOver) {
                    updatePositions();
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isRacing, raceOver]);

    const updatePositions = () => {
        setPositions(prevPositions => {
            const newPositions = prevPositions.map(pos => {
                // Случайная скорость от 0.1 до 0.3 (движение вперед)
                const speed = Math.random() * 10 + 3;
                return pos + speed; // Обновляем позицию
            });

            // Проверка на завершение гонки
            if (newPositions.every(pos => pos >= totalLaps * Math.PI * radius)) {
                setRaceOver(true);
                setIsRacing(false);
            }

            return newPositions;
        });
    };

    const startRace = () => {
        setRaceOver(false);
        setIsRacing(true);
    };

    // Определяем лидера
    const leaderIndex = positions.reduce((maxIndex, pos, index, arr) =>
        pos > arr[maxIndex] ? index : maxIndex, 0);

    return (
        <div className="race-container">
            <div className="stats">
                <h1>Гонка!</h1>
                <button onClick={startRace} disabled={isRacing}>
                    Начать гонку
                </button>
                <div className="results">
                    <h2>Результаты:</h2>
                    {positions.map((pos, index) => (
                        <p key={index}>
                            {characters[index]}: {Math.floor(pos / (Math.PI * radius))} кругов
                            {index === leaderIndex && " (Лидер!)"}
                        </p>
                    ))}
                </div>
            </div>
            <div className="track">
                {characters.map((char, index) => {
                    // Угол в радианах на основе позиции
                    const angle = (positions[index] / (Math.PI * radius)) * 2 * Math.PI; 
                    // Вычисление координат по кругу относительно центра
                    const x = radius + radius * Math.cos(angle); // Положение по X (центр + радиус * косинус)
                    const y = radius + radius * Math.sin(angle); // Положение по Y (центр + радиус * синус)

                    return (
                        <div key={index} className="runner" style={{
                            left: `${x}px`,
                            bottom: `${y}px`,
                        }}>
                            {char}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Race;