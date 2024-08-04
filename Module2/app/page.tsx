import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex flex-col items-center pt-12">SPL-Token Program</div>
      <div className="flex flex-row items-center pt-12">
        <Link href="/create-token">
          <div className="p-4 m-2 bg-blue-500 text-white rounded">
            Create Token
          </div>
        </Link>
        <Link href="/mint-token">
          <div className="p-4 m-2 bg-blue-500 text-white rounded">
            Mint Token
          </div>
        </Link>
        <Link href="/transfer-token">
          <div className="p-4 m-2 bg-blue-500 text-white rounded">
            Transfer Token
          </div>
        </Link>
        <Link href="/burn-token">
          <div className="p-4 m-2 bg-blue-500 text-white rounded">
            Burn Token
          </div>
        </Link>
        <Link href="/delegate">
          <div className="p-4 m-2 bg-blue-500 text-white rounded">
            Delegate Token
          </div>
        </Link>
      </div>
    </main>
  );
}
