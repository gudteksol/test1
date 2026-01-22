import { useEffect, useState } from 'react';

interface TokenData {
  price: string;
  marketCap: string;
  volume24h: string;
  holders: string;
}

export default function TickerCarousel() {
  const [tokenData] = useState<TokenData>({
    price: '$0.00042',
    marketCap: '$2.1M',
    volume24h: '$450K',
    holders: '1,337'
  });

  return (
    <div className="relative overflow-hidden bg-black/50 backdrop-blur-sm border-b border-green-500/30">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">PRICE:</span>
                <span className="text-white">{tokenData.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">MARKET CAP:</span>
                <span className="text-white">{tokenData.marketCap}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">24H VOLUME:</span>
                <span className="text-white">{tokenData.volume24h}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">HOLDERS:</span>
                <span className="text-white">{tokenData.holders}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
