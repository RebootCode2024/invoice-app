"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Navbar from "./components/Navbar"; // Corrected import path

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Check user session

  useEffect(() => {
    // Redirect to invoice if logged in
    if (status === "authenticated") {
      router.push("/invoice");
    }
  }, [status, router]);

  const handleInvoiceAccess = () => {
    if (status === "unauthenticated") {
      // If not logged in, start the Google sign-in process
      signIn("google");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main style={{ textAlign: "center", paddingTop: "20px" }}>
        <h1>Welcome to Geeta Footwear</h1>
        <button
          onClick={handleInvoiceAccess}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          disabled={status === "loading"} // Disable button during session loading
        >
          {status === "loading" ? "Loading..." : "Invoice"}
        </button>
      </main>
    </div>
  );
}
