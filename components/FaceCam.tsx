// components/FaceCam.tsx
"use client";

import { RefObject } from "react";

interface FaceCamProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export default function FaceCam({ videoRef }: FaceCamProps) {
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
}
