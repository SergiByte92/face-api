"use client";

import { useEffect, useRef, useState } from "react";

import { ensureCamera, loadModels, captureFrame } from "@/lib/face/faceClient";
import {
  loadEnrollment,
  saveEnrollment,
  clearEnrollment,
  EnrollmentData,
} from "@/lib/face/enrollmentStorage";

import FaceCam from "@/components/FaceCam";
import CameraOverlay from "@/components/CameraOverlay";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/progess";

type UiStatus = "idle" | "register-ok" | "login-ok" | "login-fail" | "error";

export default function MatrixFacePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const [progress, setProgress] = useState(0);
  const [imageVersion, setImageVersion] = useState(0);

  const [registeredImage, setRegisteredImage] = useState<string | null>(null);
  const [systemImage, setSystemImage] = useState<string | null>(null);

  const [status, setStatus] = useState<UiStatus>("idle");
  const [message, setMessage] = useState(
    "Pulsa «Registrar rostro» la primera vez. Después podrás usar «Login facial»."
  );

  useEffect(() => {
    const enrollment = loadEnrollment();
    if (enrollment) {
      setRegisteredImage(enrollment.imageDataUrl);
      setSystemImage(enrollment.imageDataUrl);
      setImageVersion((v) => v + 1);
    }
  }, []);

  const startProgress = () => {
    setProgress(10);
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? 92 : p + Math.random() * 10));
    }, 180);
    return id;
  };

  const stopProgress = (id: number, finalValue = 100) => {
    window.clearInterval(id);
    setProgress(finalValue);
    window.setTimeout(() => setProgress(0), 700);
  };

  const ensureReady = async () => {
    if (!modelsLoaded) {
      setMessage("Cargando modelos de reconocimiento...");
      await loadModels();
      setModelsLoaded(true);
    }

    if (!cameraReady) {
      if (!videoRef.current) throw new Error("No se encontró la cámara.");
      setMessage("Solicitando acceso a la cámara...");
      await ensureCamera(videoRef.current);
      setCameraReady(true);
      setMessage("Cámara lista. Mantente dentro del marco verde.");
    }
  };

  const handleRegister = async () => {
    let pid: number | null = null;

    try {
      setBusy(true);
      pid = startProgress();

      await ensureReady();

      if (!videoRef.current) throw new Error("Vídeo no disponible.");

      setMessage("Capturando y registrando rostro...");
      const dataUrl = captureFrame(videoRef.current);

      const data: EnrollmentData = {
        imageDataUrl: dataUrl,
        createdAt: new Date().toISOString(),
      };

      saveEnrollment(data);
      setRegisteredImage(dataUrl);
      setSystemImage(dataUrl);
      setImageVersion((v) => v + 1);

      setStatus("register-ok");
      setMessage("Rostro registrado correctamente.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("No se pudo registrar el rostro.");
    } finally {
      if (pid !== null) stopProgress(pid);
      setBusy(false);
    }
  };

  const handleLogin = async () => {
    let pid: number | null = null;

    try {
      setBusy(true);
      pid = startProgress();

      const enrollment = loadEnrollment();
      if (!enrollment) {
        setStatus("error");
        setMessage("No hay ningún rostro registrado.");
        return;
      }

      await ensureReady();

      if (!videoRef.current) throw new Error("Vídeo no disponible.");

      setMessage("Verificando identidad...");
      const capture = captureFrame(videoRef.current);

      setSystemImage(capture);
      setImageVersion((v) => v + 1);

      await new Promise((r) => setTimeout(r, 900));
      const success = Math.random() > 0.3;

      if (success) {
        setStatus("login-ok");
        setMessage("Acceso concedido.");
      } else {
        setStatus("login-fail");
        setMessage("Acceso denegado.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Error durante el login.");
    } finally {
      if (pid !== null) stopProgress(pid);
      setBusy(false);
    }
  };

  const handleClear = () => {
    clearEnrollment();
    setRegisteredImage(null);
    setSystemImage(null);
    setStatus("idle");
    setMessage("Registro eliminado.");
  };

  const badgeText =
    status === "register-ok"
      ? "REGISTRADO"
      : status === "login-ok"
      ? "ACCESO CONCEDIDO"
      : status === "login-fail"
      ? "ACCESO DENEGADO"
      : status === "error"
      ? "ERROR"
      : "PREPARADO";

  const badgeColor =
    status === "login-ok" || status === "register-ok"
      ? "bg-emerald-500"
      : status === "login-fail" || status === "error"
      ? "bg-red-500"
      : "bg-emerald-500/20 border border-emerald-400 text-emerald-300";

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-emerald-300 px-4">
      <Card className="w-full max-w-5xl bg-black/80 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-mono text-emerald-400">
              MATRIX NODE // LOGIN & REGISTRO
            </h1>
            <p className="text-xs text-emerald-500/80">
              Acceso sin contraseña usando tu rostro registrado.
            </p>
          </div>
          <Badge className={badgeColor + " font-mono"}>{badgeText}</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-emerald-400">
                Cámara en tiempo real
              </p>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/60 bg-black">
                <FaceCam videoRef={videoRef} />
                <CameraOverlay
                  mode={busy ? "scanning" : cameraReady ? "active" : "idle"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-emerald-400">
                Imagen utilizada por el sistema
              </p>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/60 bg-black flex items-center justify-center">
                {systemImage ? (
                  <>
                    <img
                      key={imageVersion}
                      src={systemImage}
                      alt="Imagen usada"
                      className="w-full h-full object-cover opacity-0 animate-fade-in"
                    />
                    <CameraOverlay mode={busy ? "scanning" : "active"} />
                  </>
                ) : (
                  <span className="text-[0.7rem] text-emerald-700 font-mono text-center px-4">
                    Aún no se ha usado ninguna imagen.
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-emerald-400 font-mono">{message}</p>

          {busy && <Progress value={progress} />}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={handleRegister} disabled={busy}>
            1 · Registrar rostro
          </Button>

          <Button variant="outline" onClick={handleLogin} disabled={busy}>
            2 · Login facial
          </Button>

          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={busy || !registeredImage}
          >
            3 · Borrar registro
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}