import React, { useState, useEffect, useRef } from 'react';
import './Balls.css';

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const Ball = ({ x, y, color }) => (
  <div
    className="ball"
    style={{
      backgroundColor: color,
      transform: `translate(${x}px, ${y}px)`,
    }}
  ></div>
);

const BouncingBallGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [ballCount, setBallCount] = useState(5); // Начальное количество шаров
  const [singleBall, setSingleBall] = useState({
    x: 50,
    y: 50,
    dx: 2,
    dy: -2,
    color: getRandomColor(),
  });
  const [multiBalls, setMultiBalls] = useState([]);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);

  const toggleGame = () => {
    setIsRunning(!isRunning);
  };

  const initializeMultiBalls = () => {
    const balls = Array.from({ length: ballCount }, () => ({
      x: Math.random() * 250,
      y: Math.random() * 250,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      color: getRandomColor(),
    }));
    setMultiBalls(balls);
  };

  const handleBallCountChange = (e) => {
    setBallCount(Number(e.target.value));
  };

  const handleUpdateBalls = () => {
    initializeMultiBalls();
  };

  const updateSingleBall = () => {
    setSingleBall((prevBall) => {
      let { x, y, dx, dy, color } = prevBall;
      if (!containerRef1.current) return prevBall;

      const rect = containerRef1.current.getBoundingClientRect();
      const maxX = rect.width - 20;
      const maxY = rect.height - 20;

      if (x + dx > maxX || x + dx < 0) dx = -dx;
      if (y + dy > maxY || y + dy < 0) dy = -dy;

      return { x: x + dx, y: y + dy, dx, dy, color };
    });
  };

  const checkCollision = (ball, otherBall) => {
    const dx = otherBall.x - ball.x;
    const dy = otherBall.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 20; // Шары считаются сталкивающимися, если расстояние между ними меньше их диаметра
  };

  const updateMultiBalls = () => {
    setMultiBalls((prevBalls) => {
      return prevBalls.map((ball, index) => {
        let { x, y, dx, dy, color } = ball;
        if (!containerRef2.current) return ball;

        const rect = containerRef2.current.getBoundingClientRect();
        const maxX = rect.width - 20;
        const maxY = rect.height - 20;

        // Столкновения со стенками
        if (x + dx > maxX || x + dx < 0) dx = -dx;
        if (y + dy > maxY || y + dy < 0) dy = -dy;

        // Столкновения с другими шарами
        prevBalls.forEach((otherBall, otherIndex) => {
          if (index !== otherIndex && checkCollision(ball, otherBall)) {
            dx = -dx;
            dy = -dy;
          }
        });

        return { x: x + dx, y: y + dy, dx, dy, color };
      });
    });
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        updateSingleBall();
        updateMultiBalls();
      }, 16); // около 60 FPS
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    initializeMultiBalls();
  }, [ballCount]); // Обновить шары при изменении количества

  return (
    <div className="bouncing-ball-game">
      <h1>Арканоид</h1>
      <button onClick={toggleGame}>
        {isRunning ? 'Стоп' : 'Пуск'}
      </button>

      <div className="controls">
        <label>
          Количество шаров: 
          <input
            type="number"
            value={ballCount}
            onChange={handleBallCountChange}
            min="1"
            max="20"
          />
        </label>
        <button onClick={handleUpdateBalls}>Обновить</button>
      </div>

      <div className="play-areas">
        <div className="play-area" ref={containerRef2}>
          {multiBalls.map((ball, index) => (
            <Ball key={index} x={ball.x} y={ball.y} color={ball.color} />
          ))}
        </div>

        <div className="play-area" ref={containerRef1}>
          <Ball x={singleBall.x} y={singleBall.y} color={singleBall.color} />
        </div>
      </div>
    </div>
  );
};

export default BouncingBallGame;
