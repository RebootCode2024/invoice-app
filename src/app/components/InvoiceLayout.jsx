// src/app/components/InvoiceLayout.jsx
import React, { useState } from 'react';

const InvoiceLayout = () => {
  const [items, setItems] = useState([]);
  const [qty, setQty] = useState('');
  const [endRate, setEndRate] = useState('');

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
  };

  // Calculate Total Amount Before Tax
  const totalAmountBeforeTax = items.reduce((acc, item) => acc + parseFloat(item.rate), 0);

  // Calculate CGST and SGST (6% each) without rounding yet
  const cgst = totalAmountBeforeTax * 0.06;
  const sgst = totalAmountBeforeTax * 0.06;

  // Calculate Total Tax by adding CGST and SGST
  const totalTax = cgst + sgst;

  // Calculate Total Amount After Tax and round it to the nearest integer
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

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #000', padding: '8px' }}>Qty</th>
            <th style={{ borderBottom: '1px solid #000', padding: '8px' }}>End Rate</th>
            <th style={{ borderBottom: '1px solid #000', padding: '8px' }}>Unit Rate</th>
            <th style={{ borderBottom: '1px solid #000', padding: '8px' }}>Rate</th>
            <th style={{ borderBottom: '1px solid #000', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '8px', textAlign: 'center' }}>{item.qty}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.endRate}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.unitRate}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.rate}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div style={{ textAlign: 'right', marginTop: '20px', marginRight: '5%' }}>
        <hr style={{ border: '1px solid #000', marginBottom: '10px' }} />
        <p><strong>Total Amount Before Tax:</strong> ₹{totalAmountBeforeTax.toFixed(2)}</p>
        <p><strong>CGST (6%):</strong> ₹{cgst.toFixed(2)}</p>
        <p><strong>SGST (6%):</strong> ₹{sgst.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> ₹{totalTax.toFixed(2)}</p>
        <p><strong>Total Amount After Tax:</strong> ₹{totalAmountAfterTax}</p>
      </div>

      {/* Clear Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={clearContents} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default InvoiceLayout;
