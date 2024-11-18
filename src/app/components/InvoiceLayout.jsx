"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import
import { useInvoice } from "../context/InvoiceContext";
import { useSession } from "next-auth/react"; // Import for session data
import Calculator from "./Calculator";

const InvoiceLayout = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Get session data
  const {
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
  } = useInvoice();

  const [qty, setQty] = useState("");
  const [endRate, setEndRate] = useState("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [pendingAdd, setPendingAdd] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  let recognition;

  const initSpeechRecognition = () => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const speechResult =
          event.results[event.results.length - 1][0].transcript.trim();
        setTranscript((prev) => `${prev}\n${speechResult}`);
        processCommand(speechResult.toLowerCase());
      };

      recognition.onerror = () => setListening(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) initSpeechRecognition();
    if (recognition) {
      listening ? recognition.stop() : recognition.start();
      setListening(!listening);
    }
  };

  const processCommand = (command) => {
    if (command.includes("quantity")) {
      const quantity = command.split("quantity")[1].trim().split(" ")[0];
      if (!isNaN(quantity)) setQty(quantity);
    }
    if (command.includes("rate")) {
      const rate = command.split("rate")[1].trim().split(" ")[0];
      if (!isNaN(rate)) setEndRate(rate);
    }
    if (command.includes("add item")) {
      setPendingAdd(true);
      setTranscript("");
      recognition.stop();
      setListening(false);
    }
  };

  useEffect(() => {
    if (pendingAdd && qty && endRate) {
      addItem(qty, endRate);
      setPendingAdd(false);
      setQty("");
      setEndRate("");
    }
  }, [qty, endRate, pendingAdd, addItem]);

  const toggleCalculator = () => setShowCalculator(!showCalculator);

  const handleClear = () => {
    clearItems();
    setQty("");
    setEndRate("");
  };

  const handleGenerateBill = () => {
    const authorizedEmails = ["rebootcode2024@gmail.com", "DSBHOJWANI@gmail.com"]; // List of authorized emails
  
    if (authorizedEmails.includes(session?.user?.email)) {
      router.push("/bill"); // Navigate to the bill page if authorized
    } else {
      alert("You are not authorized"); // Alert for unauthorized users
    }
  };
  
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2em", textAlign: "center", fontWeight: "bold" }}>
        Invoice
      </h1>

      {/* Customer Details Input */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{
              padding: "10px",
              flex: "1",
              fontSize: "1em",
              color: "black",
            }}
          />
          <button
            onClick={() => setCustomerName("")}
            style={{
              padding: "10px",
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            style={{
              padding: "10px",
              flex: "1",
              fontSize: "1em",
              color: "black",
            }}
          />
          <button
            onClick={() => setContactNumber("")}
            style={{
              padding: "10px",
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Item Input Form */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="number"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ padding: "10px", flex: "1", fontSize: "1em", color: "black" }}
        />
        <input
          type="number"
          placeholder="End Rate"
          value={endRate}
          onChange={(e) => setEndRate(e.target.value)}
          style={{ padding: "10px", flex: "1", fontSize: "1em", color: "black" }}
        />
        <button
          onClick={() => {
            addItem(qty, endRate);
            setQty("");
            setEndRate("");
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          Add Item
        </button>
        <button
          onClick={toggleListening}
          style={{
            padding: "15px",
            fontSize: "1em",
            borderRadius: "50%",
            backgroundColor: listening ? "#FF5722" : "#607D8B",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            animation: listening ? "pulse 1s infinite" : "none",
          }}
        >
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
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "2px solid white",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Qty
            </th>
            <th
              style={{
                borderBottom: "2px solid white",
                padding: "10px",
                textAlign: "center",
              }}
            >
              End Rate
            </th>
            <th
              style={{
                borderBottom: "2px solid white",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Unit Rate
            </th>
            <th
              style={{
                borderBottom: "2px solid white",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Rate
            </th>
            <th
              style={{
                borderBottom: "2px solid white",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "10px", textAlign: "center" }}>
                {item.qty}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                ₹{item.endRate}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                ₹{item.unitRate}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                ₹{item.rate}
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                <button
                  onClick={() => deleteItem(index)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      {items.length > 0 && (
        <div
          style={{
            textAlign: "right",
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#1e1e1e",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Total Amount Before Tax:</strong> ₹
            {totalAmountBeforeTax?.toFixed(2) || "0.00"}
          </p>
          <p>
            <strong>CGST (6%):</strong> ₹{cgst?.toFixed(2) || "0.00"}
          </p>
          <p>
            <strong>SGST (6%):</strong> ₹{sgst?.toFixed(2) || "0.00"}
          </p>
          <p>
            <strong>Total Tax:</strong> ₹{totalTax?.toFixed(2) || "0.00"}
          </p>
          <p>
            <strong>Total Amount After Tax:</strong> ₹
            {totalAmountAfterTax?.toFixed(2) || "0.00"}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleClear}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1em",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Clear
        </button>
        <button
          onClick={toggleCalculator}
          style={{
            padding: "10px 20px",
            backgroundColor: "#607D8B",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1em",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Calculator
        </button>
        <button
          onClick={handleGenerateBill}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          Generate Bill
        </button>
      </div>

      {showCalculator && <Calculator onClose={toggleCalculator} />}
    </div>
  );
};

export default InvoiceLayout;
