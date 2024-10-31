import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [isScientific, setIsScientific] = useState(false);

  const toggleCalculatorMode = () => {
    setIsScientific(!isScientific);
    clearInput();
  };

  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const calculateResult = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Ошибка');
    }
  };

  const clearInput = () => {
    setInput('');
  };

  const handleScientificFunction = (func) => {
    try {
      const number = parseFloat(input);
      let result;
      switch (func) {
        case 'sqrt':
          result = Math.sqrt(number);
          break;
        case 'sin':
          result = Math.sin(number);
          break;
        case 'cos':
          result = Math.cos(number);
          break;
        case 'tan':
          result = Math.tan(number);
          break;
        case 'pow2':
          result = Math.pow(number, 2);
          break;
        case 'pow3':
          result = Math.pow(number, 3);
          break;
        default:
          result = input;
      }
      setInput(result.toString());
    } catch {
      setInput('Ошибка');
    }
  };

  return (
    <div className="calculator-container">
      <h1>Калькулятор</h1>
      <button onClick={toggleCalculatorMode}>
        {isScientific ? 'Переключиться на обычный' : 'Переключиться на научный'}
      </button>
      
      <div className="calculator">
        <div className="calculator-frame">
          <h2>{isScientific ? 'Научный калькулятор' : 'Обычный калькулятор'}</h2>
          <input type="text" value={input} readOnly />
          <div className="buttons">
            {[1, 2, 3, '+'].map((btn) => (
              <button key={btn} onClick={() => handleButtonClick(btn.toString())}>
                {btn}
              </button>
            ))}
            {[4, 5, 6, '-'].map((btn) => (
              <button key={btn} onClick={() => handleButtonClick(btn.toString())}>
                {btn}
              </button>
            ))}
            {[7, 8, 9, '*'].map((btn) => (
              <button key={btn} onClick={() => handleButtonClick(btn.toString())}>
                {btn}
              </button>
            ))}
            {['C', 0, '=', '/'].map((btn) => (
              <button
                key={btn}
                onClick={
                  btn === 'C'
                    ? clearInput
                    : btn === '='
                    ? calculateResult
                    : () => handleButtonClick(btn.toString())
                }
              >
                {btn}
              </button>
            ))}
            {isScientific && (
              <>
                {['sqrt', 'sin', 'cos', 'tan', 'pow2', 'pow3'].map((func) => (
                  <button key={func} onClick={() => handleScientificFunction(func)}>
                    {func === 'sqrt' ? '√' : func === 'pow2' ? 'x²' : func === 'pow3' ? 'x³' : func}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
