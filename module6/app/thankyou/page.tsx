// thankyou.tsx
"use client";
import { useRouter } from 'next/navigation';

export default function ThankYou() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-lg mb-8">
          Your payment has been successfully processed. We appreciate your business!
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}
