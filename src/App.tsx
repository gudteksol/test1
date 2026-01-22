import TickerCarousel from './components/TickerCarousel';
import MemeGallery from './components/MemeGallery';
import MemeGenerator from './components/MemeGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <TickerCarousel />

      <main className="relative">
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <img
                src="/johnny_pfp_(12).png"
                alt="$RR Logo"
                className="w-64 h-64 object-contain drop-shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-float"
              />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text">
              $RR
            </h1>
            <p className="text-3xl md:text-4xl font-bold text-green-400 mb-4 tracking-wider">
              RAGS TO RICHES
            </p>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
              From zero to hero. The ultimate meme coin revolution is here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group relative px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                BUY $RR
              </button>
              <button className="group relative px-8 py-4 bg-transparent border-2 border-green-500 hover:border-green-400 text-green-400 hover:text-green-300 font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                JOIN COMMUNITY
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400 neon-text">
              LIVE CHART
            </h2>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border-2 border-green-500/30 overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.15)]">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://dexscreener.com/solana/YOUR_TOKEN_ADDRESS?embed=1&theme=dark&trades=0&info=0"
                  className="absolute top-0 left-0 w-full h-full"
                  title="DexScreener Chart"
                />
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4 text-sm">
              Replace YOUR_TOKEN_ADDRESS with actual token address
            </p>
          </div>
        </section>

        <MemeGenerator />

        <MemeGallery />

        <footer className="border-t border-green-500/30 py-8 px-4 text-center">
          <p className="text-gray-400">
            $RR - Rags to Riches © 2024 | From the streets to the suite
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Not financial advice. DYOR. Meme responsibly.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
