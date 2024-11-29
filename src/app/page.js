"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Check user session

  useEffect(() => {
    // Redirect to dashboard if logged in
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = () => {
    if (status === "unauthenticated") {
      // If not logged in, start the Google sign-in process
      signIn("google");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#1a1a1a", // Dark background for contrast
      }}
    >
      {/* Responsive Image */}
      <div style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}>
        <img
          src="/model.png" // Add the correct file extension
          alt="Model showcasing Geeta Footwear"
          style={{
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
      </div>

      {/* Sign-In Button */}
      <button
        onClick={handleSignIn}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          backgroundColor: "#FF5722",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
        disabled={status === "loading"} // Disable button during session loading
      >
        {status === "loading" ? "Loading..." : "Sign In"}
      </button>
    </div>
  );
}
