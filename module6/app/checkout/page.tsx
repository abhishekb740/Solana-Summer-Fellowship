"use client";
import { useCart } from "../Context/CartContext";
import { useRouter } from 'next/navigation';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import { encodeURL, createQR, findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

export default function Checkout() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const merchant = new PublicKey('Hs7zkFzonu8XQspcvEjnJWYpc1uZXwhUiZWfk87ptVEe');

  const generateURL = async (amount: number) => {
    const referenceKeypair = Keypair.generate();
    const reference = referenceKeypair.publicKey;

    const url = encodeURL({
      recipient: merchant,
      amount: new BigNumber(amount),
      reference,
      label: 'Payment',
      memo: 'Thank you for shopping with us!'
    });

    return { url, reference };
  };

  const calculateTotalAmountInTheCart = () => {
    let amount = 0;
    for (let i = 0; i < cartItems.length; i++) {
      amount += parseFloat(cartItems[i].price);
    }
    return amount;
  };

  const handlePayment = async () => {
    try {
      const totalAmount = calculateTotalAmountInTheCart();
      const { url, reference } = await generateURL(totalAmount);
      const qr = createQR(url, 320, 'white', 'black');
      setQrCode(url.toString());

      const qrElement = document.getElementById('qr-code');
      if (qrElement) {
        qrElement.innerHTML = '';
        qr.append(qrElement);
      }

      localStorage.setItem('paymentReference', reference.toString());
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const amount = calculateTotalAmountInTheCart();
      const found = await findReference(connection, new PublicKey(reference));
      const response = await validateTransfer(
        connection,
        found.signature,
        {
          recipient: merchant,
          amount: new BigNumber(amount),
          splToken: undefined,
          reference: new PublicKey(reference),
          memo: 'Thank you for shopping with us!',
        },
        {
          commitment: 'confirmed',
        }
      );
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStatus('Error Verifying Payment');
    }
  };

  const handleVerifyPayment = async () => {
    const reference = localStorage.getItem('paymentReference');
    if (reference) {
      const status = await verifyPayment(reference);
      if (status) {
        setPaymentStatus('Payment Verified Successfully');
        alert("Payment Verified Successfully!");
        localStorage.removeItem('paymentReference');
        clearCart();
        router.push('/thankyou');
      }
      else{
        setPaymentStatus('Payment Verification Failed');
      }
    } else {
      setPaymentStatus('No Payment Reference Found');
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <div className="text-4xl">Checkout</div>
        <button onClick={() => router.push('/')} className="text-2xl rounded-md border py-2 px-4">Go Back</button>
      </div>
      {cartItems.length === 0 ? (
        <div className="text-lg">Your cart is empty</div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border p-4 rounded-lg">
              <div>
                <img src={item.image} className="w-24 h-24 rounded-lg" alt={item.name} />
                <div className="text-lg font-bold">{item.name}</div>
                <div className="text-lg">{item.price}</div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex flex-row justify-between">
            <button
              onClick={clearCart}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-8"
            >
              Clear Cart
            </button>
            <button
              className="bg-green-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-8"
              onClick={handlePayment}
            >
              Checkout
            </button>
          </div>
          <div className="mt-8">
            {qrCode && (
              <>
                <div className="text-lg">Scan the QR code below to make a payment:</div>
                <div id="qr-code" className="mt-4"></div>
              </>
            )}
          </div>
          <div className="mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleVerifyPayment}
            >
              Verify Payment
            </button>
            {paymentStatus && <div className="mt-4 text-lg">{paymentStatus}</div>}
          </div>
        </div>
      )}
    </main>
  );
}