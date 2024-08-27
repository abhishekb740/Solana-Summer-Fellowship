"use client";
import { useCart } from "./Context/CartContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { addToCart, clearCart, cartItems } = useCart();
  const router = useRouter();
  const Products = [
    {
      id: 1,
      name: 'Puma Mid-Top Sneakers',
      price: '0.45 SOL',
      image: 'puma.jpg',
    },
    {
      id: 2,
      name: 'Nike Air Max',
      price: '0.2 SOL',
      image: 'nike.jpg',
    },
    {
      id: 3,
      name: 'Adidas Superstar',
      price: '0.35 SOL',
      image: 'adidas.jpg',
    },
    {
      id: 4,
      name: 'Converse All-Star',
      price: '0.41 SOL',
      image: 'converse.jpg',
    },
    {
      id: 5,
      name: 'Vans Old Skool',
      price: '0.54 SOL',
      image: 'vanoldskool.jpg',
    },
    {
      id: 6,
      name: 'Reebok Classic',
      price: '0.6 SOL',
      image: 'rebook.jpg',
    }
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-row justify-center p-8">
        <div className="text-2xl">Solana Pay - Module 6</div>
      </div>

      <div className="grid grid-cols-3 gap-8 p-8">
        {Products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img src={product.image} className="aspect-video rounded-xl" alt={product.name} />
            <div className="text-lg font-bold pt-4">{product.name}</div>
            <div className="text-lg">{product.price}</div>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-0 m-8">
        <button onClick={() => router.push('/checkout')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Checkout ({cartItems.length})
        </button>
      </div>
    </main>
  );
}
