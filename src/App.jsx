import React, { useState } from 'react';
import BouncingBallGame from './pracs/prac1-2/Balls';
import Calculator from './pracs/prac3-4/Calculator';
import CaesarCipher from './pracs/prac5/CaesarCipher';
import Game from './pracs/prac6/Game';
import LabyrinthGame from './pracs/prac7/Labyrinth';
import Race from './pracs/prac10/Race';
import './App.css';

function App() {
  const [currentComponent, setCurrentComponent] = useState('BouncingBallGame');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Математика для программирования</h1>
        <div className="buttons">
          <button onClick={() => setCurrentComponent('BouncingBallGame')}>Практика 1-2</button>
          <button onClick={() => setCurrentComponent('Calculator')}>Практика 3-4</button>
          <button onClick={() => setCurrentComponent('CaesarCipher')}>Практика 5</button>
          <button onClick={() => setCurrentComponent('Game')}>Морской бой(не включать!!!)</button>
          <button onClick={() => setCurrentComponent('LabyrinthGame')}>Лабиринт</button>
          <button onClick={() => setCurrentComponent('Race')}>Праkтика 8</button>
        </div>
      </header>
      <main className="App-main">
        {currentComponent === 'BouncingBallGame' && <BouncingBallGame />}
        {currentComponent === 'Calculator' && <Calculator />}
        {currentComponent === 'CaesarCipher' && <CaesarCipher />}
        {currentComponent === 'Game' && <Game />}
        {currentComponent === 'LabyrinthGame' && <LabyrinthGame />}
        {currentComponent === 'Race' && <Race />}
      </main>
    </div>
  );
}

export default App;
