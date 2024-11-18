"use client";

import { SessionProvider } from "next-auth/react";
import { InvoiceProvider } from "./context/InvoiceContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <InvoiceProvider>{children}</InvoiceProvider>
    </SessionProvider>
  );
}
