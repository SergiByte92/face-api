"use client";

import { useRef, useState } from "react";
import type { IdentifyStatus } from "@/lib/face/faceTypes";
import { FacePhase } from "@/lib/face/faceTypes";
import { loadModels, ensureCamera, detectAndVerify } from "@/lib/face/faceClient";

import FaceCam from "@/components/FaceCam";
import StatusStepper from "@/components/StatusStepper";
import CameraOverlay from "@/components/CameraOverlay";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/progess";
import { Badge } from "@/components/ui/badge";

interface Props {
  onFinished: (status: IdentifyStatus) => void;
}

export default function IdentificationView({ onFinished }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [phase, setPhase] = useState<FacePhase>("idle");
  const [message, setMessage] = useState("Preparado para empezar");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    setPhase("loadingModels");
    setMessage("Cargando modelos...");
    await loadModels();
    setPhase("cameraPermission");
    setMessage("Modelos cargados. Autoriza la cámara.");
    setBusy(false);
  };

  const startCamera = async () => {
    if (!videoRef.current) return;
    setBusy(true);
    setPhase("cameraPermission");
    await ensureCamera(videoRef.current);
    setPhase("cameraReady");
    setMessage("Cámara lista. Mira al frente.");
    setBusy(false);
  };

  const identify = async () => {
    if (!videoRef.current) return;
    setBusy(true);
    setPhase("detecting");
    setMessage("Analizando rostro...");
    const result = await detectAndVerify(videoRef.current);
    setBusy(false);

    if (result.verified) {
      setPhase("verified");
      onFinished("ok");
    } else {
      setPhase("notVerified");
      onFinished("fail");
    }
  };

  const badge = {
    idle: "Esperando",
    loadingModels: "Cargando",
    cameraPermission: "Permisos",
    cameraReady: "Cámara lista",
    detecting: "Detectando",
    verified: "Verificado",
    notVerified: "No verificado",
    error: "Error",
  }[phase];

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Login facial</h1>
          <Badge>{badge}</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <StatusStepper phase={phase} />

          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <FaceCam videoRef={videoRef} />
            <CameraOverlay phase={phase} />
          </div>

          {phase === "loadingModels" && <Progress value={40} />}
          {phase === "detecting" && <Progress value={80} />}

          <p className="text-sm text-muted-foreground">{message}</p>
        </CardContent>

        <CardFooter className="flex gap-2 justify-between">
          <Button disabled={busy} onClick={load}>Cargar modelos</Button>
          <Button disabled={busy} onClick={startCamera}>Iniciar cámara</Button>
          <Button disabled={busy || phase !== "cameraReady"} onClick={identify}>
            Identificar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}