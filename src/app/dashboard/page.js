"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session } = useSession(); // Get session data for authenticated users
  const router = useRouter();

  React.useEffect(() => {
    // Redirect unauthenticated users to the homepage
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#000",
        color: "white",
        height: "100vh",
      }}
    >
      <h1>Welcome, {session.user.name}</h1>
      <button
        onClick={() => signOut()}
        style={{
          padding: "10px 20px",
          fontSize: "1em",
          color: "white",
          backgroundColor: "#FF5722",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Sign Out
      </button>
      <button
        onClick={() => router.push("/invoice")}
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
        Invoice
      </button>
    </div>
  );
};

export default Dashboard;
