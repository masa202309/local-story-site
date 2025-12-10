"use client";

import { MapPin } from "lucide-react";

const areas = ["駅前", "本町", "南町", "中央", "北区"];

interface HeroProps {
  onAreaSelect: (area: string) => void;
}

export default function Hero({ onAreaSelect }: HeroProps) {
  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">
          一杯のコーヒーから始まる、
          <br className="md:hidden" />
          あなたの物語
        </h2>
        <p className="text-amber-700 mb-8">
          地元の名店で生まれた思い出を、ショートストーリーで共有しよう
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => onAreaSelect(area)}
              className="flex items-center gap-1 bg-white px-4 py-2 rounded-full text-sm text-amber-800 hover:bg-amber-200 transition shadow-sm"
            >
              <MapPin className="w-3 h-3" />
              {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
