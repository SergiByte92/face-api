// lib/face/faceClient.ts
"use client";

import type { DetectResult } from "./faceTypes";

// MOCK: carga de modelos de face-api
export async function loadModels(): Promise<void> {
  // Aquí iría tu código real de face-api:
  // await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  // ...
  await new Promise((r) => setTimeout(r, 800));
}

// Activa la cámara y asigna el stream al <video>
export async function ensureCamera(video: HTMLVideoElement): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) {
    throw new Error("API de cámara no disponible.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  video.srcObject = stream;
  await video.play();
}

// MOCK: detección y verificación (simulada)
export async function detectAndVerify(
  _video: HTMLVideoElement
): Promise<DetectResult> {
  // Aquí iría tu lógica real de face-api
  await new Promise((r) => setTimeout(r, 1000));

  const verified = Math.random() > 0.3;
  const confidence = verified
    ? 0.8 + Math.random() * 0.2
    : 0.3 + Math.random() * 0.3;

  return { verified, confidence };
}

// Captura un frame del vídeo y devuelve un DataURL (base64 PNG)
export function captureFrame(video: HTMLVideoElement): string {
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    throw new Error("El vídeo aún no está listo para capturar.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener el contexto 2D.");

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
