import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correctly set in your environment
if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

const client = new MongoClient(uri);
let db;

// Function to get the database connection
async function getDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("geeta_footwear"); // Replace with your database name
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw new Error("Database connection error");
    }
  }
  return db;
}

export default async function CustomerInvoicePage({ params }) {
  const { invoiceNumber } = params;

  if (!invoiceNumber) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "black" }}>Invalid Request</h1>
        <p style={{ color: "black" }}>
          The invoice number is missing from the request.
        </p>
      </div>
    );
  }

  try {
    // Get the database connection
    const database = await getDatabase();
    const invoices = database.collection("invoices");

    // Fetch the invoice using the invoice number
    const invoice = await invoices.findOne({ invoiceNumber });

    if (!invoice) {
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1 style={{ color: "black" }}>Invoice Not Found</h1>
          <p style={{ color: "black" }}>
            The invoice with the provided number does not exist.
          </p>
        </div>
      );
    }

    // Render the invoice for the customer
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
              <strong>Date:</strong>{" "}
              {new Date(invoice.date || Date.now()).toLocaleDateString()}
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
                  ₹{Number(item.unitRate || 0).toFixed(2)}
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
      </div>
    );
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "black" }}>Error</h1>
        <p style={{ color: "black" }}>
          An error occurred while loading the invoice.
        </p>
      </div>
    );
  }
}

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
