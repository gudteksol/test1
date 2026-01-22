import { useState } from 'react';

interface GeneratedMeme {
  id: string;
  imageUrl: string;
  timestamp: number;
}

export default function MemeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GeneratedMeme[]>([]);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-memes`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate memes');
      }

      const data = await response.json();

      if (data.images && data.images.length === 3) {
        setCurrentImages(data.images);

        const newMemes: GeneratedMeme[] = data.images.map((img: string) => ({
          id: `${Date.now()}-${Math.random()}`,
          imageUrl: img,
          timestamp: Date.now(),
        }));

        setGallery(prev => [...newMemes, ...prev].slice(0, 12));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate memes');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rr-meme-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCopyImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-green-400 neon-text">
          MEME GENERATOR
        </h2>

        <div className="flex justify-center mb-12">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isGenerating ? 'Loading...' : 'Generate Memes'}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {currentImages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">Latest Generation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentImages.map((imageUrl, index) => (
                <div
                  key={`current-${index}`}
                  className="relative bg-gray-900/50 rounded-lg border-2 border-green-500/30 overflow-hidden group hover:border-green-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <div className="aspect-square">
                    <img
                      src={imageUrl}
                      alt={`Generated meme ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex gap-2">
                    <button
                      onClick={() => handleDownload(imageUrl, index)}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded transition-all duration-200"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleCopyImage(imageUrl)}
                      className="flex-1 px-4 py-2 bg-transparent border border-green-500 hover:border-green-400 text-green-400 hover:text-green-300 font-semibold rounded transition-all duration-200"
                    >
                      Copy Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gallery.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((meme) => (
                <div
                  key={meme.id}
                  className="relative bg-gray-900/50 rounded-lg border border-green-500/20 overflow-hidden group hover:border-green-400/50 transition-all duration-300"
                >
                  <div className="aspect-square">
                    <img
                      src={meme.imageUrl}
                      alt="Generated meme"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleDownload(meme.imageUrl, 0)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleCopyImage(meme.imageUrl)}
                      className="px-3 py-1 bg-transparent border border-green-500 hover:border-green-400 text-green-400 text-sm font-semibold rounded"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
