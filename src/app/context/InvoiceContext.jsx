"use client"
import React, { createContext, useContext, useState } from 'react';

// Create the context
const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [items, setItems] = useState([]);

  const addItem = (qty, endRate) => {
    const unitRate = parseFloat(endRate) / 1.12;
    const rate = unitRate * parseFloat(qty);
    const newItem = {
      qty: parseFloat(qty),
      endRate: parseFloat(endRate),
      unitRate: unitRate.toFixed(2),
      rate: rate.toFixed(2),
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const clearItems = () => {
    setItems([]);
  };

  const totalAmountBeforeTax = items.reduce((acc, item) => acc + parseFloat(item.rate), 0);
  const cgst = totalAmountBeforeTax * 0.06;
  const sgst = totalAmountBeforeTax * 0.06;
  const totalTax = cgst + sgst;
  const totalAmountAfterTax = Math.round(totalAmountBeforeTax + totalTax);

  return (
    <InvoiceContext.Provider
      value={{
        customerName,
        setCustomerName,
        contactNumber,
        setContactNumber,
        items,
        addItem,
        deleteItem,
        clearItems,
        totalAmountBeforeTax,
        cgst,
        sgst,
        totalTax,
        totalAmountAfterTax,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};
