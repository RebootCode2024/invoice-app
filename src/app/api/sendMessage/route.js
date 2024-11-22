import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token
const client = twilio(accountSid, authToken);

export async function POST(req) {
  try {
    const body = await req.json(); // Parse incoming JSON body
    const { to, message } = body;

    // Validate input
    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: "Missing 'to' or 'message' fields" }),
        { status: 400 }
      );
    }

    // Send SMS using Twilio
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to, // Recipient's phone number
    });

    // Return success response
    return new Response(
      JSON.stringify({ success: true, sid: response.sid }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending SMS:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  // Handle unexpected GET requests
  return new Response(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405 }
  );
}
