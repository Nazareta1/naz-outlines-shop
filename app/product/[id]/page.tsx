import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

const PRODUCTS = {
  "hoodie-black": {
    id: "hoodie-black",
    name: "NAZ Hoodie (Black)",
    description: "High quality auto + streetwear design.",
    price: 59.99,
    image: "/logo.png",
  },
  "tee-white": {
    id: "tee-white",
    name: "NAZ Tee (White)",
    description: "High quality auto + streetwear design.",
    price: 29.99,
    image: "/logo.png",
  },
  cap: {
    id: "cap",
    name: "NAZ Cap",
    description: "High quality auto + streetwear design.",
    price: 24.99,
    image: "/logo.png",
  },
  "sticker-pack": {
    id: "sticker-pack",
    name: "Sticker Pack",
    description: "High quality auto + streetwear design.",
    price: 9.99,
    image: "/logo.png",
  },
} as const;

type Params = { id: string };

// ✅ svarbu: async + await Promise.resolve(...)
export default async function ProductPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { id } = await Promise.resolve(params);
  const product = (PRODUCTS as any)[id];

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Product not found</h1>
        <p className="text-gray-600 mb-6">ID: {id}</p>
        <Link href="/products" className="underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link href="/products" className="underline">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        <div className="bg-gray-100 rounded flex items-center justify-center h-80">
          <Image
            src={product.image}
            alt={product.name}
            width={320}
            height={220}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-2xl font-bold mb-6">€{product.price}</div>

          <AddToCartButton id={product.id} name={product.name} price={product.price} />
        </div>
      </div>
    </div>
  );
}
