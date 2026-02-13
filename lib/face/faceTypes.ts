export type FacePhase =
  | "idle"
  | "loadingModels"
  | "cameraPermission"
  | "cameraReady"
  | "detecting"
  | "verified"
  | "notVerified"
  | "error";

export interface DetectResult {
  verified: boolean;
  confidence: number;
}
