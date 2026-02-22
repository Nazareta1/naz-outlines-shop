import Link from "next/link";

/* ---------------- PRODUCTS DATABASE ---------------- */

const PRODUCTS = [
  {
    id: "hoodie-black",
    name: "NAZ Hoodie (Black)",
    price: 59.99,
    category: "Hoodie",
    image: "/logo.png",
  },

  {
    id: "tee-white",
    name: "NAZ Tee (White)",
    price: 29.99,
    category: "T-shirt",
    image: "/logo.png",
  },

  {
    id: "cap",
    name: "NAZ Cap",
    price: 24.99,
    category: "Cap",
    image: "/logo.png",
  },

  {
    id: "sticker-pack",
    name: "Sticker Pack",
    price: 9.99,
    category: "Accessories",
    image: "/logo.png",
  },
];

/* ---------------- PAGE ---------------- */

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* TITLE */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-gray-600">
            Pasirink produktą ir atsidarys jo puslapis.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {PRODUCTS.length} products
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            
            {/* IMAGE */}
            <div className="bg-gray-100 h-48 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-24 object-contain"
              />
            </div>

            {/* INFO */}
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">
                {product.category}
              </div>

              <h2 className="font-semibold mb-2">
                {product.name}
              </h2>

              <div className="font-bold mb-3">
                €{product.price}
              </div>

              {/* LINK */}
              <Link
                href={`/product/${product.id}`}
                className="text-sm underline hover:text-gray-700"
              >
                View product →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
