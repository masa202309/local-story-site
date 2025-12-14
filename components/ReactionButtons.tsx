"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin, Heart, Coffee } from "lucide-react";

type ReactionCounts = {
  visit: number;
  touched: number;
  warm: number;
};

const columnMap: Record<keyof ReactionCounts, "reactions_visit" | "reactions_touched" | "reactions_warm"> = {
  visit: "reactions_visit",
  touched: "reactions_touched",
  warm: "reactions_warm",
};

export function ReactionButtons({
  storyId,
  initialCounts,
}: {
  storyId: string;
  initialCounts: ReactionCounts;
}) {
  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [loading, setLoading] = useState<keyof ReactionCounts | null>(null);
  const [error, setError] = useState("");

  const handleReaction = async (key: keyof ReactionCounts) => {
    if (loading) return;
    setLoading(key);
    setError("");

    try {
      const updatePayload: Record<string, number> = {
        [columnMap[key]]: counts[key] + 1,
      };

      const { data, error: updateError } = await supabase
        .from("stories")
        .update(updatePayload)
        .eq("id", storyId)
        .select("reactions_visit,reactions_touched,reactions_warm")
        .single();

      if (updateError || !data) throw updateError || new Error("update failed");

      setCounts({
        visit: data.reactions_visit,
        touched: data.reactions_touched,
        warm: data.reactions_warm,
      });
    } catch (err) {
      console.error(err);
      setError("リアクションを送信できませんでした。時間をおいて再度お試しください。");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 border-t border-b border-gray-100 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-500 mr-2">この物語に</span>
        <button
          onClick={() => handleReaction("visit")}
          disabled={loading !== null}
          className="flex items-center gap-1 px-4 py-2 bg-amber-50 rounded-full text-sm text-amber-700 hover:bg-amber-100 transition disabled:opacity-50"
        >
          <MapPin className="w-4 h-4" /> 行きたい {counts.visit}
        </button>
        <button
          onClick={() => handleReaction("touched")}
          disabled={loading !== null}
          className="flex items-center gap-1 px-4 py-2 bg-pink-50 rounded-full text-sm text-pink-700 hover:bg-pink-100 transition disabled:opacity-50"
        >
          <Heart className="w-4 h-4" /> 泣けた {counts.touched}
        </button>
        <button
          onClick={() => handleReaction("warm")}
          disabled={loading !== null}
          className="flex items-center gap-1 px-4 py-2 bg-orange-50 rounded-full text-sm text-orange-700 hover:bg-orange-100 transition disabled:opacity-50"
        >
          <Coffee className="w-4 h-4" /> ほっこり {counts.warm}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

