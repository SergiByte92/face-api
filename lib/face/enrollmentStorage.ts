// lib/face/enrollmentStorage.ts
"use client";

export interface EnrollmentData {
  imageDataUrl: string;   // captura en base64
  createdAt: string;      // ISO date
}

const STORAGE_KEY = "matrix-face-enrollment";

export function saveEnrollment(data: EnrollmentData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadEnrollment(): EnrollmentData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EnrollmentData;
  } catch {
    return null;
  }
}

export function clearEnrollment() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
