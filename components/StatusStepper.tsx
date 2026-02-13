import { FacePhase } from "@/lib/face/faceTypes";

export default function StatusStepper({ phase }: { phase: FacePhase }) {
  const steps = [
    "loadingModels",
    "cameraPermission",
    "cameraReady",
    "detecting",
    "verified",
  ];

  return (
    <div className="flex justify-between text-xs">
      {steps.map((s) => (
        <span
          key={s}
          className={phase === s ? "text-primary font-bold" : "text-muted"}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
