"use client";

import { useState } from "react"; // Adjust the import path based on your directory
import VideoPlayer from "@/components/videoplayer/VideoPlayer";

function detectVideoType(url: string): "youtube" | "hls" | "video" | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube detection
  const ytPatterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of ytPatterns) {
    if (pattern.test(trimmed)) return "youtube";
  }

  // HLS / M3U8 detection
  if (trimmed.endsWith(".m3u8") || trimmed.includes(".m3u8?")) return "hls";

  // Generic video
  if (/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(trimmed)) return "video";

  return null;
}

export default function CustomVideoPlay() {
  const [inputUrl, setInputUrl] = useState("");
  const [activeUrl, setActiveUrl] = useState("");
  const [error, setError] = useState("");

  const videoType = detectVideoType(activeUrl);

  function handlePlay() {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setError("Please provide a valid URL.");
      return;
    }
    const type = detectVideoType(trimmed);
    if (!type) {
      setError(
        "Unsupported URL format. Please use YouTube, M3U8, MP4, or WebM links.",
      );
      return;
    }
    setError("");
    setActiveUrl(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handlePlay();
  }

  return (
    <div>
      {/* Input section */}
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          type="url"
          placeholder="Paste YouTube URL or M3U8 / MP4 link here..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
        <button className="btn btn-gradient" onClick={handlePlay}>
          Play Video
        </button>
      </div>

      {/* Error Feedback */}
      {error && (
        <p className="text-red-400 text-xs font-medium mb-3 transition-all animate-fadeIn">
          {error}
        </p>
      )}

      {/* Player Frame Display */}
      <div className="bg-black/50 border border-foreground/10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 shadow-xl">
        {!activeUrl ? (
          <div className="text-center text-slate-500 aspect-video w-full flex flex-col items-center justify-center">
            <span className="text-5xl block mb-3 animate-pulse filter drop-shadow-md">
              📺
            </span>
            <p className="text-lg font-semibold text-slate-400">
              No Video Loaded
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter a stream source URL above to begin smooth streaming
              playback.
            </p>
          </div>
        ) : (
          <VideoPlayer url={activeUrl} type={videoType} />
        )}
      </div>
    </div>
  );
}
