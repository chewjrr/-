import React, { useState } from 'react';
import BouncingBallGame from './pracs/prac1-2/Balls';
import Calculator from './pracs/prac3-4/Calculator';
import CaesarCipher from './pracs/prac5/CaesarCipher';
import SeaBattle from './pracs/prac6/SeaBattle';
import LabyrinthGame from './pracs/prac7/Labyrinth';
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
          <button onClick={() => setCurrentComponent('SeaBattle')}>Морской бой(не включать!!!)</button>
          <button onClick={() => setCurrentComponent('LabyrinthGame')}>Лабиринт</button>
        </div>
      </header>
      <main className="App-main">
        {currentComponent === 'BouncingBallGame' && <BouncingBallGame />}
        {currentComponent === 'Calculator' && <Calculator />}
        {currentComponent === 'CaesarCipher' && <CaesarCipher />}
        {currentComponent === 'SeaBattle' && <SeaBattle />}
        {currentComponent === 'LabyrinthGame' && <LabyrinthGame />}
      </main>
    </div>
  );
}

export default App;
