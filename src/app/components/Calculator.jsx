// src/app/components/Calculator.jsx
import React, { useState } from 'react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [newEntry, setNewEntry] = useState(false);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]); // Track calculation history
  const [showHistory, setShowHistory] = useState(false); // Toggle history view

  const handleNumberClick = (number) => {
    if (newEntry) {
      setDisplay(number);
      setNewEntry(false);
    } else {
      setDisplay((prevDisplay) => (prevDisplay === '0' ? number : prevDisplay + number));
    }
  };

  const handleOperatorClick = (op) => {
    if (operator && !newEntry) {
      calculate();
    }
    setPrevValue(parseFloat(display));
    setOperator(op);
    setExpression(`${display} ${op}`);
    setNewEntry(true);
  };

  const calculate = () => {
    if (operator && prevValue != null) {
      const current = parseFloat(display);
      let result;
      switch (operator) {
        case '+':
          result = prevValue + current;
          break;
        case '-':
          result = prevValue - current;
          break;
        case '*':
          result = prevValue * current;
          break;
        case '/':
          result = prevValue / current;
          break;
        default:
          return;
      }
      const fullExpression = `${expression} ${display} = ${result}`;
      setDisplay(String(result));
      setPrevValue(result);
      setOperator(null);
      setExpression('');
      setHistory([...history, fullExpression]); // Save to history
      setNewEntry(true);
    }
  };

  const handleEqualsClick = () => {
    if (operator) {
      calculate();
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setNewEntry(false);
    setExpression('');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '300px', margin: '10px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Calculator</h2>
        <button onClick={onClose} style={{ padding: '5px 10px', cursor: 'pointer', fontSize: '1em' }}>X</button>
      </div>

      {/* Expression Display */}
      <div style={{ fontSize: '1em', marginBottom: '5px', textAlign: 'right', color: '#666', padding: '5px' }}>
        {expression}
      </div>

      {/* Main Display */}
      <div style={{ fontSize: '2em', marginBottom: '10px', textAlign: 'right', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', overflowX: 'auto' }}>
        {display}
      </div>

      {/* History Button */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button onClick={() => setShowHistory(!showHistory)} style={{ fontSize: '0.8em', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', borderRadius: '5px', border: 'none' }}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* Calculator History */}
      {showHistory && (
        <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '0.9em', marginBottom: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px', backgroundColor: '#fafafa' }}>
          {history.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No history</p>
          ) : (
            history.map((entry, index) => <p key={index} style={{ margin: '5px 0' }}>{entry}</p>)
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {[7, 8, 9].map((num) => (
          <button key={num} onClick={() => handleNumberClick(String(num))} style={{ padding: '20px', fontSize: '1.5em' }}>{num}</button>
        ))}
        <button onClick={() => handleOperatorClick('/')} style={{ padding: '20px', fontSize: '1.5em' }}>/</button>

        {[4, 5, 6].map((num) => (
          <button key={num} onClick={() => handleNumberClick(String(num))} style={{ padding: '20px', fontSize: '1.5em' }}>{num}</button>
        ))}
        <button onClick={() => handleOperatorClick('*')} style={{ padding: '20px', fontSize: '1.5em' }}>×</button>

        {[1, 2, 3].map((num) => (
          <button key={num} onClick={() => handleNumberClick(String(num))} style={{ padding: '20px', fontSize: '1.5em' }}>{num}</button>
        ))}
        <button onClick={() => handleOperatorClick('-')} style={{ padding: '20px', fontSize: '1.5em' }}>−</button>

        <button onClick={() => handleNumberClick('0')} style={{ padding: '20px', fontSize: '1.5em' }}>0</button>
        <button onClick={() => handleNumberClick('.')} style={{ padding: '20px', fontSize: '1.5em' }}>.</button>
        <button onClick={handleEqualsClick} style={{ padding: '20px', fontSize: '1.5em' }}>=</button>
        <button onClick={() => handleOperatorClick('+')} style={{ padding: '20px', fontSize: '1.5em' }}>+</button>
      </div>

      <button onClick={handleClear} style={{ marginTop: '10px', padding: '10px', width: '100%', fontSize: '1.5em', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Clear</button>
    </div>
  );
};

export default Calculator;
