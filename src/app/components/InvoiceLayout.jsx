import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';

const InvoiceLayout = () => {
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [items, setItems] = useState([]);
  const [qty, setQty] = useState('');
  const [endRate, setEndRate] = useState('');
  const [listening, setListening] = useState(false); // Track microphone status
  const [transcript, setTranscript] = useState(''); // Hidden recognized text
  const [pendingAdd, setPendingAdd] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false); // Toggle calculator

  let recognition;

  const initSpeechRecognition = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const speechResult = event.results[event.results.length - 1][0].transcript.trim();
        console.log("Speech recognized:", speechResult);
        setTranscript((prev) => `${prev}\n${speechResult}`);
        processCommand(speechResult.toLowerCase());
      };

      recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setListening(false);
      };
    } else {
      console.warn('Speech recognition is not supported in this browser.');
    }
  };

  const toggleListening = () => {
    if (!recognition) initSpeechRecognition();
    if (recognition) {
      if (listening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setListening(!listening);
    } else {
      console.warn("Speech recognition is not initialized or supported.");
    }
  };

  const processCommand = (command) => {
    if (command.includes('quantity')) {
      const quantity = command.split('quantity')[1].trim().split(' ')[0];
      if (!isNaN(quantity)) setQty(quantity);
    }
    if (command.includes('rate')) {
      const rate = command.split('rate')[1].trim().split(' ')[0];
      if (!isNaN(rate)) setEndRate(rate);
    }
    if (command.includes('add item') || command.includes('ad item')) {
      setPendingAdd(true);
      setTranscript('');
      recognition.stop();
      setListening(false);
    }
  };

  useEffect(() => {
    if (pendingAdd && qty && endRate) {
      addItem();
      setPendingAdd(false);
    }
  }, [qty, endRate, pendingAdd]);

  const addItem = () => {
    if (qty && endRate) {
      const unitRate = parseFloat(endRate) / 1.12;
      const rate = unitRate * parseFloat(qty);
      const newItem = {
        qty: parseFloat(qty),
        endRate: parseFloat(endRate),
        unitRate: unitRate.toFixed(2),
        rate: rate.toFixed(2),
      };
      setItems([...items, newItem]);
      setQty('');
      setEndRate('');
    } else {
      console.warn("Quantity or Rate missing. Please try again.");
    }
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const clearContents = () => {
    setItems([]);
    setQty('');
    setEndRate('');
    setTranscript('');
  };

  const totalAmountBeforeTax = items.reduce((acc, item) => acc + parseFloat(item.rate), 0);
  const cgst = totalAmountBeforeTax * 0.06;
  const sgst = totalAmountBeforeTax * 0.06;
  const totalTax = cgst + sgst;
  const totalAmountAfterTax = Math.round(totalAmountBeforeTax + totalTax);

  const toggleCalculator = () => setShowCalculator(!showCalculator);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2em', textAlign: 'center', fontWeight: 'bold' }}>Invoice</h1>

      {/* Customer Details Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ padding: '10px', flex: '1', fontSize: '1em' }}
          />
          <button
            onClick={() => setCustomerName('')}
            style={{ padding: '10px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            style={{ padding: '10px', flex: '1', fontSize: '1em' }}
          />
          <button
            onClick={() => setContactNumber('')}
            style={{ padding: '10px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Item Input Form */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="number"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ padding: '10px', flex: '1', fontSize: '1em' }}
        />
        <input
          type="number"
          placeholder="End Rate"
          value={endRate}
          onChange={(e) => setEndRate(e.target.value)}
          style={{ padding: '10px', flex: '1', fontSize: '1em' }}
        />
        <button onClick={addItem} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1em', cursor: 'pointer' }}>Add Item</button>
        <button onClick={toggleListening} style={{
          padding: '15px',
          fontSize: '1em',
          borderRadius: '50%',
          backgroundColor: listening ? '#FF5722' : '#607D8B',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          animation: listening ? 'pulse 1s infinite' : 'none'
        }}>
          🎤
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #000', padding: '10px', textAlign: 'center' }}>Qty</th>
            <th style={{ borderBottom: '2px solid #000', padding: '10px', textAlign: 'center' }}>End Rate</th>
            <th style={{ borderBottom: '2px solid #000', padding: '10px', textAlign: 'center' }}>Unit Rate</th>
            <th style={{ borderBottom: '2px solid #000', padding: '10px', textAlign: 'center' }}>Rate</th>
            <th style={{ borderBottom: '2px solid #000', padding: '10px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{item.qty}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>₹{item.endRate}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>₹{item.unitRate}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>₹{item.rate}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={() => deleteItem(index)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <hr style={{ border: '1px solid #000', marginBottom: '10px' }} />
        <p><strong>Total Amount Before Tax:</strong> ₹{totalAmountBeforeTax.toFixed(2)}</p>
        <p><strong>CGST (6%):</strong> ₹{cgst.toFixed(2)}</p>
        <p><strong>SGST (6%):</strong> ₹{sgst.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> ₹{totalTax.toFixed(2)}</p>
        <p><strong>Total Amount After Tax:</strong> ₹{totalAmountAfterTax}</p>
      </div>

      {/* Clear and Calculator Buttons */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={clearContents} style={{ padding: '10px 20px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1em', cursor: 'pointer', marginRight: '10px' }}>Clear</button>
        <button onClick={toggleCalculator} style={{ padding: '10px 20px', backgroundColor: '#607D8B', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1em', cursor: 'pointer' }}>Calculator</button>
      </div>

      {showCalculator && <Calculator onClose={toggleCalculator} />}
    </div>
  );
};

export default InvoiceLayout;
