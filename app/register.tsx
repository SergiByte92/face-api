"use client";

import { useRef, useState, useEffect } from "react";
import { ensureCamera, loadModels, captureFrame } from "@/lib/face/faceClient";
import {
  EnrollmentData,
  saveEnrollment,
  clearEnrollment,
  loadEnrollment,
} from "@/lib/face/enrollmentStorage";

import FaceCam from "@/components/FaceCam";
import CameraOverlay from "@/components/CameraOverlay";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [loadingModels, setLoadingModels] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [message, setMessage] = useState(
    "1) Carga los modelos. 2) Activa la cámara. 3) Captura y registra tu rostro."
  );
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);

  useEffect(() => {
    setEnrollment(loadEnrollment());
  }, []);

  const handleLoadModels = async () => {
    setLoadingModels(true);
    setMessage("Cargando modelos Matrix...");
    await loadModels();
    setLoadingModels(false);
    setMessage("Modelos listos. Ahora activa la cámara.");
  };

  const handleStartCamera = async () => {
    if (!videoRef.current) {
      setMessage("No se ha encontrado la cámara.");
      return;
    }
    setMessage("Solicitando acceso a la cámara...");
    await ensureCamera(videoRef.current);
    setCameraReady(true);
    setMessage("Cámara activa. Asegúrate de estar centrado en el marco verde.");
  };

  const handleCaptureAndRegister = () => {
    if (!cameraReady || !videoRef.current) {
      setMessage("Activa la cámara antes de capturar.");
      return;
    }

    try {
      const dataUrl = captureFrame(videoRef.current);
      const data: EnrollmentData = {
        imageDataUrl: dataUrl,
        createdAt: new Date().toISOString(),
      };
      saveEnrollment(data);
      setEnrollment(data);
      setMessage("Rostro capturado y registrado correctamente.");
    } catch (err) {
      console.error(err);
      setMessage("No se pudo capturar la imagen. Vuelve a intentarlo.");
    }
  };

  const handleClear = () => {
    clearEnrollment();
    setEnrollment(null);
    setMessage("Registro facial eliminado.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-emerald-300 px-4">
      <Card className="w-full max-w-5xl bg-black/80 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-mono tracking-wider text-emerald-400">
              MATRIX NODE // REGISTRO
            </h1>
            <p className="text-xs text-emerald-500/80">
              Paso 1: registrar tu rostro como “contraseña visual”.
            </p>
          </div>
          <Badge className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono">
            {enrollment ? "REGISTRO ACTIVO" : "SIN REGISTRO"}
          </Badge>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">
          {/* Columna izquierda: cámara */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/60 bg-black">
              <FaceCam videoRef={videoRef} />
              <CameraOverlay
                phase={cameraReady ? "cameraReady" : "cameraPermission"}
              />
            </div>

            <p className="text-xs text-emerald-400 font-mono">{message}</p>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 font-mono"
                onClick={handleLoadModels}
                disabled={loadingModels}
              >
                1 · Cargar modelos
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 font-mono"
                onClick={handleStartCamera}
                disabled={loadingModels}
              >
                2 · Activar cámara
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 font-mono"
                onClick={handleCaptureAndRegister}
                disabled={!cameraReady}
              >
                3 · Capturar y registrar
              </Button>
            </div>
          </div>

          {/* Columna derecha: registro actual */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono text-emerald-300 uppercase tracking-widest">
              Registro almacenado
            </h2>

            <div className="relative aspect-video rounded-xl border border-emerald-500/40 bg-black/80 flex items-center justify-center">
              {enrollment?.imageDataUrl ? (
                <img
                  src={enrollment.imageDataUrl}
                  alt="Registro facial"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-xs text-emerald-600 font-mono text-center px-4">
                  Todavía no has registrado tu rostro. Captura y registra una
                  vez y quedará guardado en este dispositivo.
                </span>
              )}
            </div>

            <Button
              size="sm"
              variant="destructive"
              className="font-mono w-full"
              onClick={handleClear}
              disabled={!enrollment}
            >
              Borrar registro
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between text-xs text-emerald-600 font-mono">
          <span>IFP // Matrix Access Prototype</span>
          <span>Ruta: /register</span>
        </CardFooter>
      </Card>
    </main>
  );
}
