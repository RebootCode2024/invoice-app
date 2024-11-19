"use client";
import React, { useState, useEffect } from "react";
import { useInvoice } from "../context/InvoiceContext";

const GenerateBill = () => {
  const {
    customerName,
    contactNumber,
    items,
    totalAmountBeforeTax,
    cgst,
    sgst,
    totalTax,
    totalAmountAfterTax,
  } = useInvoice();

  // State to manage invoice number and date
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({ date: "", time: "" });

  // Generate and set values only on the client
  useEffect(() => {
    // Generate random invoice number
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    setInvoiceNumber(`gfw-${randomDigits}`);

    // Format date and time
    const todayDate = new Date();
    const formattedDate = `${todayDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(todayDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${todayDate.getFullYear().toString().slice(-2)}`;
    const currentTime = todayDate.toLocaleTimeString();

    setCurrentDateTime({ date: formattedDate, time: currentTime });
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "20px auto",
        backgroundColor: "white",
        color: "black",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: "0", fontSize: "1.8em" }}>GEETA FOOT WEAR</h1>
        <p style={{ margin: "5px 0" }}>
          A-1, Arif Chamber-1, Kapoorthala Aliganj, Lucknow-226021
        </p>
        <p style={{ margin: "5px 0" }}>
          GSTIN: 09AGNPB2973M1ZU &nbsp;|&nbsp; Ph: +91-9839277778
        </p>
      </div>

      {/* Invoice Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: "1 1 45%", marginBottom: "10px" }}>
          <p>
            <strong>Invoice No.:</strong> {invoiceNumber || "Generating..."}
          </p>
          <p>
            <strong>Date:</strong> {currentDateTime.date || "Loading..."} &nbsp;{" "}
            {currentDateTime.time || "Loading..."}
          </p>
        </div>
        <div style={{ flex: "1 1 45%", marginBottom: "10px" }}>
          <p>
            <strong>Name:</strong> {customerName || "N/A"}
          </p>
          <p>
            <strong>Contact Number:</strong> {contactNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          fontSize: "0.9em",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Qty</th>
            <th style={tableHeaderStyle}>Name of Product</th>
            <th style={tableHeaderStyle}>HSN</th>
            <th style={tableHeaderStyle}>Rate</th>
            <th style={tableHeaderStyle}>GST</th>
            <th style={tableHeaderStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.qty}</td>
                <td style={tableCellStyle}>{item.productName || "Chappal"}</td>
                <td style={tableCellStyle}>6402</td>
                <td style={tableCellStyle}>₹{(item.endRate / 1.12).toFixed(2)}</td>
                <td style={tableCellStyle}>12%</td>
                <td style={tableCellStyle}>₹{item.rate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tableCellStyle} colSpan="6">
                No items added
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary Section */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
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

      {/* Terms and Conditions */}
      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#555" }}>
        <p>Terms & Conditions:</p>
        <ul>
          <li>No Guarantee, No Claim</li>
          <li>Once Sold Will Not Be Taken Back</li>
          <li>Once Change Will Be Not Change Again</li>
          <li>Change only within a Week</li>
          <li>All Subject Disputes in Lucknow Jurisdiction</li>
        </ul>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Certified that the particulars given above are true and correct.
        </p>
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          For GEETA FOOT WEAR
        </p>
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          (Authorised Signatory)
        </p>
      </div>
    </div>
  );
};

// Table Styles
const tableHeaderStyle = {
  borderBottom: "2px solid black",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
};

const tableCellStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

export default GenerateBill;
