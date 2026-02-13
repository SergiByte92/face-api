// components/CameraOverlay.tsx
"use client";

export type OverlayMode = "idle" | "active" | "scanning";

export default function CameraOverlay({ mode }: { mode: OverlayMode }) {
  return (
    <>
      {/* Marco interior */}
      <div className="absolute inset-6 rounded-xl border border-emerald-400/80" />

      {/* Indicador HUD */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-emerald-400/50 bg-black/60 px-3 py-1 text-[10px] font-mono text-emerald-300">
        <span
          className={[
            "inline-block h-2 w-2 rounded-full",
            mode === "scanning"
              ? "bg-emerald-300 animate-pulse"
              : mode === "active"
              ? "bg-emerald-300"
              : "bg-emerald-300/25",
          ].join(" ")}
        />
        <span>
          {mode === "scanning"
            ? "SCANNING"
            : mode === "active"
            ? "SIGNAL OK"
            : "STANDBY"}
        </span>
      </div>

      {/* Scan line */}
      {mode === "scanning" && (
        <div className="pointer-events-none absolute inset-6 overflow-hidden rounded-xl">
          <div className="scanline absolute left-0 right-0 h-[2px] bg-emerald-300/80" />
        </div>
      )}
    </>
  );
}
