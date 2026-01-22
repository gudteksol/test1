const memes = [
  { id: 1, text: 'WHEN LAMBO?', subtitle: 'SOON™' },
  { id: 2, text: 'TO THE MOON', subtitle: 'VERY SOON' },
  { id: 3, text: 'DIAMOND HANDS', subtitle: 'HOLD STRONG' },
  { id: 4, text: 'RAGS TODAY', subtitle: 'RICHES TOMORROW' },
  { id: 5, text: 'HODL', subtitle: 'NEVER SELL' },
  { id: 6, text: 'WEN MOON?', subtitle: 'ANY MOMENT NOW' }
];

export default function MemeGallery() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400 neon-text">
        MEME GALLERY
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border-2 border-green-500/30 hover:border-green-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center p-6 group cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <p className="text-2xl md:text-3xl font-bold text-green-400 mb-3 neon-text-sm">
                {meme.text}
              </p>
              <p className="text-lg text-gray-400">
                {meme.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
