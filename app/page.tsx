export default function HomePage() {
  return (
    <div className="space-y-16">

      {/* HERO BANNER */}
      <section className="bg-black text-white py-20 px-6 rounded-xl">
        <div className="max-w-6xl mx-auto text-center space-y-6">

          <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
            NAZ OUTLINES
          </h1>

          <p className="text-white/70 text-lg">
            auto + streetwear
          </p>

          <button className="mt-4 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition">
            Shop Now
          </button>

        </div>
      </section>


      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6">

        <h2 className="text-2xl font-bold mb-6">
          Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* AUTO */}
          <div className="bg-black text-white p-10 rounded-xl hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-bold">Auto</h3>
            <p className="text-white/70">Decals • Wraps • Outlines</p>
          </div>

          {/* STREETWEAR */}
          <div className="bg-zinc-900 text-white p-10 rounded-xl hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-bold">Streetwear</h3>
            <p className="text-white/70">Hoodies • Tees • Caps</p>
          </div>

        </div>
      </section>


      {/* FEATURED */}
      <section className="max-w-6xl mx-auto px-6">

        <h2 className="text-2xl font-bold mb-6">
          Featured Drops
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {[1,2,3,4].map((item) => (
            <div
              key={item}
              className="border rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="aspect-square bg-zinc-200 rounded mb-3" />

              <h4 className="font-semibold">
                Product {item}
              </h4>

              <p className="text-sm text-zinc-500">
                €49.99
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

