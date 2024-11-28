import React, { useState } from 'react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]); // Track calculation history
  const [showHistory, setShowHistory] = useState(false); // Toggle history view

  const handleNumberClick = (number) => {
    setDisplay((prevDisplay) => prevDisplay + number);
    setExpression((prevExpr) => prevExpr + number);
  };

  const handleOperatorClick = (op) => {
    if (expression === '' && op !== '-') {
      // Do not allow operators at the start except minus
      return;
    }

    const lastChar = expression.slice(-1);

    if (['+', '-', '*', '/'].includes(lastChar)) {
      // Replace the last operator with the new one
      setExpression((prevExpr) => prevExpr.slice(0, -1) + op);
    } else {
      setExpression((prevExpr) => prevExpr + op);
    }

    setDisplay('');
  };

  const calculate = () => {
    try {
      // Sanitize expression to prevent code injection
      const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');

      // Evaluate the expression
      const result = new Function('return ' + sanitizedExpression)();
      const fullExpression = `${expression} = ${result}`;
      setDisplay(String(result));
      setExpression(String(result));
      setHistory([...history, fullExpression]);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleEqualsClick = () => {
    if (expression === '') return;
    calculate();
  };

  const handleClear = () => {
    setDisplay('');
    setExpression('');
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        maxWidth: '300px',
        margin: '10px auto',
        color: 'white',
      }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>Calculator</h2>
        <button
          onClick={onClose}
          style={{ padding: '5px 10px', cursor: 'pointer', fontSize: '1em', color: 'white' }}
        >
          X
        </button>
      </div>

      {/* Expression Display */}
      <div
        style={{
          fontSize: '1em',
          marginBottom: '5px',
          textAlign: 'right',
          color: 'white',
          padding: '5px',
          borderBottom: '1px solid #ccc',
        }}
      >
        {expression || '0'}
      </div>

      {/* Main Display */}
      <div
        style={{
          fontSize: '2em',
          marginBottom: '10px',
          textAlign: 'right',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          overflowX: 'auto',
          color: 'black',
        }}
      >
        {display || '0'}
      </div>

      {/* History Button */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            fontSize: '0.8em',
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: 'orange',
            color: 'white',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* Calculator History */}
      {showHistory && (
        <div
          style={{
            maxHeight: '100px',
            overflowY: 'auto',
            fontSize: '0.9em',
            marginBottom: '10px',
            border: '1px solid #ccc',
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: '#fafafa',
          }}
        >
          {history.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No history</p>
          ) : (
            history.map((entry, index) => (
              <p key={index} style={{ margin: '5px 0', color: 'black' }}>
                {entry}
              </p>
            ))
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {[7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(String(num))}
            style={{
              padding: '20px',
              fontSize: '1.5em',
              backgroundColor: 'orange',
              color: 'black',
            }}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOperatorClick('/')}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          /
        </button>

        {[4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(String(num))}
            style={{
              padding: '20px',
              fontSize: '1.5em',
              backgroundColor: 'orange',
              color: 'black',
            }}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOperatorClick('*')}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          ×
        </button>

        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(String(num))}
            style={{
              padding: '20px',
              fontSize: '1.5em',
              backgroundColor: 'orange',
              color: 'black',
            }}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOperatorClick('-')}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          −
        </button>

        <button
          onClick={() => handleNumberClick('0')}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          0
        </button>
        <button
          onClick={() => handleNumberClick('.')}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          .
        </button>
        <button
          onClick={handleEqualsClick}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          =
        </button>
        <button
          onClick={() => handleOperatorClick('+')}
          style={{
            padding: '20px',
            fontSize: '1.5em',
            backgroundColor: 'orange',
            color: 'black',
          }}
        >
          +
        </button>
      </div>

      <button
        onClick={handleClear}
        style={{
          marginTop: '10px',
          padding: '10px',
          width: '100%',
          fontSize: '1.5em',
          backgroundColor: 'orange',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default Calculator;
