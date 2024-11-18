"use client";

import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession(); // Get session data for the signed-in user

  return (
    <nav
      style={{
        backgroundColor: "#333",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}
    >
      {/* Left Section */}
      <div>
        <Link
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            marginRight: "20px",
            fontSize: "16px",
          }}
        >
          Home
        </Link>
      </div>

      {/* Center Section */}
      <div style={{ fontSize: "1.5em", fontWeight: "bold", textAlign: "center" }}>
        Geeta Footwear
      </div>

      {/* Right Section: Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {session ? (
          <>
            <img
              src={session.user.image || "/default-profile.png"} // Fallback to a default image
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
            <button
              onClick={() => signOut()}
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
