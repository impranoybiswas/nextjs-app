"use client";

import { useState, useRef } from "react";
import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

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

export default function VideoPlayer() {
  const [inputUrl, setInputUrl] = useState("");
  const [activeUrl, setActiveUrl] = useState("");
  const [error, setError] = useState("");
  const playerRef = useRef<MediaPlayerInstance>(null);

  const videoType = detectVideoType(activeUrl);

  function handlePlay() {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setError("একটি URL দিন।");
      return;
    }
    const type = detectVideoType(trimmed);
    if (!type) {
      setError(
        "অচেনা URL। YouTube লিংক, .m3u8 বা .mp4/.webm লিংক দিন।"
      );
      return;
    }
    setError("");
    setActiveUrl(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handlePlay();
  }

  // Build the src prop Vidstack expects
  function buildSrc(url: string, type: "youtube" | "hls" | "video" | null) {
    if (!type) return "";
    if (type === "youtube") return url;
    if (type === "hls") return { src: url, type: "application/x-mpegurl" };
    return url;
  }

  return (
    <div className="vp-wrapper">
      {/* Input row */}
      <div className="vp-input-row">
        <input
          className="vp-input"
          type="url"
          placeholder="YouTube URL বা M3U8 / MP4 লিংক দিন…"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
        <button className="vp-btn" onClick={handlePlay}>
          ▶ চালাও
        </button>
      </div>

      {error && <p className="vp-error">{error}</p>}

      {/* Player area */}
      <div className="vp-player-area">
        {!activeUrl ? (
          <div className="vp-empty">
            <span className="vp-empty-icon">📺</span>
            <p>কোনো ভিডিও নেই।</p>
            <p className="vp-empty-hint">
              উপরে YouTube লিংক বা M3U8/MP4 URL দিয়ে চালু করুন।
            </p>
          </div>
        ) : (
          <MediaPlayer
            ref={playerRef}
            src={buildSrc(activeUrl, videoType) as any}
            autoPlay
            className="vp-media-player"
            title="Video Player"
          >
            <MediaProvider />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </MediaPlayer>
        )}
      </div>

      <style>{`
        .vp-wrapper {
          font-family: 'Segoe UI', system-ui, sans-serif;
          max-width: 860px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .vp-input-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .vp-input {
          flex: 1;
          padding: 0.65rem 1rem;
          border: 2px solid #334155;
          border-radius: 0.5rem;
          background: #0f172a;
          color: #f1f5f9;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .vp-input::placeholder { color: #64748b; }
        .vp-input:focus { border-color: #6366f1; }

        .vp-btn {
          padding: 0.65rem 1.4rem;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .vp-btn:hover { background: #4f46e5; }

        .vp-error {
          color: #f87171;
          font-size: 0.85rem;
          margin: 0 0 0.5rem;
        }

        .vp-player-area {
          background: #0f172a;
          border-radius: 0.75rem;
          overflow: hidden;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #1e293b;
        }

        .vp-media-player {
          width: 100%;
          aspect-ratio: 16/9;
        }

        .vp-empty {
          text-align: center;
          color: #64748b;
          padding: 3rem;
        }
        .vp-empty-icon { font-size: 3rem; display: block; margin-bottom: 0.75rem; }
        .vp-empty p { margin: 0.25rem 0; font-size: 1.05rem; }
        .vp-empty-hint { font-size: 0.85rem; color: #475569; margin-top: 0.5rem !important; }
      `}</style>
    </div>
  );
}