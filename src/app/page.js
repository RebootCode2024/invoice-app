"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const navigateToInvoice = () => {
    router.push('/invoice');
  };

  return (
    <main style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h1>Welcome to Geeta Footwear</h1>
      <button
        onClick={navigateToInvoice}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Invoice
      </button>
    </main>
  );
}
