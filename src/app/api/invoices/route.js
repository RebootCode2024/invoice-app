import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Connection string from environment variables
if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

// Create a single instance of MongoClient
const client = new MongoClient(uri);
let clientPromise;

// Function to ensure MongoDB client is connected
async function connectToDatabase() {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  await clientPromise;
  return client.db("geeta_footwear"); // Replace with your database name
}

export async function GET(request) {
  try {
    const database = await connectToDatabase(); // Ensure connection is established
    const invoices = database.collection("invoices");

    const invoiceList = await invoices.find({}).toArray(); // Fetch all invoices
    return new Response(JSON.stringify(invoiceList), { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch invoices" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json(); // Parse request body
    const database = await connectToDatabase(); // Ensure connection is established
    const invoices = database.collection("invoices");

    const result = await invoices.insertOne(body); // Insert invoice data
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return new Response(JSON.stringify({ error: "Failed to create invoice" }), { status: 500 });
  }
}
