// src/app/components/InvoiceLayout.jsx
import React, { useState, useEffect } from 'react';

const InvoiceLayout = () => {
  const [items, setItems] = useState([]);
  const [qty, setQty] = useState('');
  const [endRate, setEndRate] = useState('');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pendingAdd, setPendingAdd] = useState(false); // Tracks if add item is pending

  let recognition;

  // Function to initialize speech recognition
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

  // Start or stop listening
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

  // Process recognized speech commands
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
      setPendingAdd(true); // Set pending add to true
      setTranscript(''); // Clear the transcript after preparing to add item
      recognition.stop();
      setListening(false);
    }
  };

  // Effect to trigger addItem when both qty and endRate are set and pendingAdd is true
  useEffect(() => {
    if (pendingAdd && qty && endRate) {
      addItem();
      setPendingAdd(false); // Reset pending add
    }
  }, [qty, endRate, pendingAdd]); // Trigger whenever qty, endRate, or pendingAdd changes

  // Add Item to Table
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

  // Delete Item from Table
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Clear all contents
  const clearContents = () => {
    setItems([]);
    setQty('');
    setEndRate('');
    setTranscript('');
  };

  // Calculate Total Amount Before Tax
  const totalAmountBeforeTax = items.reduce((acc, item) => acc + parseFloat(item.rate), 0);
  const cgst = totalAmountBeforeTax * 0.06;
  const sgst = totalAmountBeforeTax * 0.06;
  const totalTax = cgst + sgst;
  const totalAmountAfterTax = Math.round(totalAmountBeforeTax + totalTax);

  return (
    <div>
      <h1>Invoice</h1>

      {/* Item Input Form */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="number"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ padding: '8px', flex: '1 1 100px' }}
        />
        <input
          type="number"
          placeholder="End Rate"
          value={endRate}
          onChange={(e) => setEndRate(e.target.value)}
          style={{ padding: '8px', flex: '1 1 100px' }}
        />
        <button onClick={addItem} style={{ padding: '8px', flex: '1 1 auto' }}>Add Item</button>
      </div>

      {/* Microphone Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={toggleListening} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {listening ? 'Stop Listening' : 'Click to Speak'}
        </button>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
          {listening ? 'Listening...' : 'Click the button to start voice commands'}
        </div>
      </div>

      {/* Display Transcript */}
      <textarea
        value={transcript}
        readOnly
        rows="4"
        placeholder="Recognized Speech"
        style={{ width: '100%', marginTop: '20px' }}
      />

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Qty</th>
            <th>End Rate</th>
            <th>Unit Rate</th>
            <th>Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.qty}</td>
              <td>₹{item.endRate}</td>
              <td>₹{item.unitRate}</td>
              <td>₹{item.rate}</td>
              <td><button onClick={() => deleteItem(index)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div style={{ textAlign: 'right', marginTop: '20px', marginRight: '5%' }}>
        <p><strong>Total Amount Before Tax:</strong> ₹{totalAmountBeforeTax.toFixed(2)}</p>
        <p><strong>CGST (6%):</strong> ₹{cgst.toFixed(2)}</p>
        <p><strong>SGST (6%):</strong> ₹{sgst.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> ₹{totalTax.toFixed(2)}</p>
        <p><strong>Total Amount After Tax:</strong> ₹{totalAmountAfterTax}</p>
      </div>

      {/* Clear Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={clearContents} style={{ padding: '10px 20px', cursor: 'pointer' }}>Clear</button>
      </div>
    </div>
  );
};

export default InvoiceLayout;
