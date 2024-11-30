"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const InvoicePage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { invoiceNumber } = useParams(); // Get the dynamic invoice number from the URL
  const router = useRouter(); // For navigation
  const [invoice, setInvoice] = useState(null);

  const authorizedEmails = ["rebootcode2024@gmail.com"]; // Add authorized emails here

  useEffect(() => {
    // Check if the logged-in user's email is authorized
    if (status === "authenticated") {
      if (!authorizedEmails.includes(session?.user?.email)) {
        alert("You are not authorized. Contact Harsh Bhojwani");
        router.push("/"); // Redirect unauthorized users to the home page
        return;
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    // Retrieve data from localStorage using invoice number
    if (invoiceNumber) {
      const storedInvoice = localStorage.getItem(invoiceNumber);
      if (storedInvoice) {
        setInvoice(JSON.parse(storedInvoice));
      }
    }
  }, [invoiceNumber]);

  const handleSendToCustomer = async () => {
    if (!invoice || !invoice.contactNumber) {
      alert("Customer contact information is missing.");
      return;
    }

    try {
      // Step 1: Save the invoice in the database
      const saveResponse = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice), // Send the entire invoice object
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save the invoice in the database.");
      }

      const saveData = await saveResponse.json();
      alert("Invoice saved successfully!");

      // Step 2: Send the invoice link to the customer
      const customerLink = `https://geeta-footwear.vercel.app/customer/${invoice.invoiceNumber}`;
      const sendMessageResponse = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: invoice.contactNumber,
          message: `Hello ${invoice.customerName}, your invoice is ready. View it here: ${customerLink}. Thank you for buying from Geeta Footwear!`,
        }),
      });

      if (!sendMessageResponse.ok) {
        throw new Error("Failed to send the message to the customer.");
      }

      const sendMessageData = await sendMessageResponse.json();
      alert("Invoice link sent to the customer successfully!");

      // Step 3: Redirect the user back to the invoice list page
      router.push("/invoice");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  };

  if (!invoice) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "black" }}>Invoice not found</h1>
        <p style={{ color: "black" }}>
          It seems you have refreshed the page or no invoice data was found.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontWeight: "bold" }}>GEETA FOOT WEAR</h1>
        <p>A-1, Arif Chamber-1, Kapoorthala Aliganj, Lucknow-226021</p>
        <p>GSTIN: 09AGNPB2973M1ZU &nbsp;|&nbsp; Ph: +91-9839277778</p>
      </div>

      {/* Invoice and Customer Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <p>
            <strong>Invoice No.:</strong> {invoice.invoiceNumber}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <div>
          <p>
            <strong>Name:</strong> {invoice.customerName}
          </p>
          <p>
            <strong>Contact Number:</strong> {invoice.contactNumber}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <thead>
          <tr>
            <th style={headerCellStyle}>Qty</th>
            <th style={headerCellStyle}>Name of Product</th>
            <th style={headerCellStyle}>HSN</th>
            <th style={headerCellStyle}>Rate</th>
            <th style={headerCellStyle}>GST</th>
            <th style={headerCellStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td style={cellStyle}>{item.qty}</td>
              <td style={cellStyle}>{item.productName || "Chappal"}</td>
              <td style={cellStyle}>6402</td>
              <td style={cellStyle}>
                ₹{(item.endRate / 1.12).toFixed(2)}
              </td>
              <td style={cellStyle}>12%</td>
              <td style={cellStyle}>₹{Number(item.rate || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <p>
          <strong>Total Amount Before Tax:</strong> ₹
          {invoice.totalAmountBeforeTax.toFixed(2)}
        </p>
        <p>
          <strong>CGST (6%):</strong> ₹{invoice.cgst.toFixed(2)}
        </p>
        <p>
          <strong>SGST (6%):</strong> ₹{invoice.sgst.toFixed(2)}
        </p>
        <p>
          <strong>Total Tax:</strong> ₹{invoice.totalTax.toFixed(2)}
        </p>
        <p style={{ fontWeight: "bold" }}>
          <strong>Total Amount After Tax:</strong> ₹
          {invoice.totalAmountAfterTax.toFixed(2)}
        </p>
      </div>

      {/* Terms and Conditions */}
      <div style={{ marginBottom: "20px" }}>
        <p>Terms & Conditions:</p>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>No Guarantee, No Claim</li>
          <li>Once Sold Will Not Be Taken Back</li>
          <li>Once Change Will Be Not Change Again</li>
          <li>Change only within a Week</li>
          <li>All Subject Disputes in Lucknow Jurisdiction</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center" }}>
        <p>Certified that the particulars given above are true and correct.</p>
        <p style={{ fontWeight: "bold" }}>For GEETA FOOT WEAR</p>
        <p style={{ fontStyle: "italic" }}>(Authorised Signatory)</p>
      </div>

      {/* Send to Customer Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleSendToCustomer}
          style={{
            padding: "10px 20px",
            fontSize: "1em",
            color: "white",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save & Send
        </button>
      </div>
    </div>
  );
};

// Styles for Table Cells
const headerCellStyle = {
  border: "1px solid black",
  padding: "10px",
  fontWeight: "bold",
  backgroundColor: "#f2f2f2",
  color: "black",
};

const cellStyle = {
  border: "1px solid black",
  padding: "10px",
  color: "black",
};

export default InvoicePage;
