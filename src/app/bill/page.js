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

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    setInvoiceNumber(`gfw-${randomDigits}`);

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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>GEETA FOOT WEAR</h1>
        <p style={styles.subtitle}>
          A-1, Arif Chamber-1, Kapoorthala Aliganj, Lucknow-226021
        </p>
        <p style={styles.subtitle}>
          GSTIN: 09AGNPB2973M1ZU &nbsp;|&nbsp; Ph: +91-9839277778
        </p>
      </div>

      {/* Invoice Details */}
      <div style={styles.detailsContainer}>
        <div>
          <p>
            <strong>Invoice No.:</strong> {invoiceNumber || "Generating..."}
          </p>
          <p>
            <strong>Date:</strong> {currentDateTime.date || "Loading..."} &nbsp;
            {currentDateTime.time || "Loading..."}
          </p>
        </div>
        <div>
          <p>
            <strong>Name:</strong> {customerName || "N/A"}
          </p>
          <p>
            <strong>Contact Number:</strong> {contactNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Responsive Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Name of Product</th>
              <th style={styles.th}>HSN</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>GST</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.qty}</td>
                  <td style={styles.td}>{item.productName || "Chappal"}</td>
                  <td style={styles.td}>6402</td>
                  <td style={styles.td}>₹{(item.endRate / 1.12).toFixed(2)}</td>
                  <td style={styles.td}>12%</td>
                  <td style={styles.td}>₹{item.rate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="6">
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div style={styles.summary}>
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
      <div style={styles.terms}>
        <p>Terms & Conditions:</p>
        <ul>
          <li>No Guarantee, No Claim</li>
          <li>Once Sold Will Not Be Taken Back</li>
          <li>Once Change Will Be Not Change Again</li>
          <li>Change only within a Week</li>
          <li>All Subject Disputes in Lucknow Jurisdiction</li>
        </ul>
        <p style={styles.centerText}>
          Certified that the particulars given above are true and correct.
        </p>
        <p style={{ ...styles.centerText, fontWeight: "bold" }}>
          For GEETA FOOT WEAR
        </p>
        <p style={{ ...styles.centerText, fontStyle: "italic" }}>
          (Authorised Signatory)
        </p>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    margin: "20px auto",
    backgroundColor: "white",
    color: "black",
    maxWidth: "95%",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    margin: "0",
    fontSize: "1.8em",
  },
  subtitle: {
    margin: "5px 0",
    fontSize: "0.9em",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.8em",
  },
  th: {
    borderBottom: "2px solid black",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  summary: {
    textAlign: "right",
    marginBottom: "20px",
    fontSize: "0.9em",
  },
  terms: {
    marginTop: "20px",
    fontSize: "0.8em",
    color: "#555",
  },
  centerText: {
    textAlign: "center",
  },
};

export default GenerateBill;
