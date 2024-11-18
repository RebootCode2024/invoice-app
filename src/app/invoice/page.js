"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import InvoiceLayout from "../components/InvoiceLayout";
import { useEffect } from "react";

export default function InvoicePage() {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter();

  // Redirect to homepage if user is not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Navigate to the homepage if not logged in
    }
  }, [status, router]);

  // Show a loading state while checking authentication status
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Invoice Layout */}
      <InvoiceLayout />
    </div>
  );
}
