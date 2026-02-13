// components/ResultPanel.tsx
"use client";

interface Props {
  registeredImage: string | null;
  currentCapture: string | null;
  phase: string; // simplificado para no pelear con tipos
}

export default function ResultPanel({
  registeredImage,
  currentCapture,
  phase,
}: Props) {
  const anyImage = currentCapture || registeredImage;
  const src = currentCapture ?? registeredImage ?? null;

  let description: string;

  if (!anyImage) {
    description =
      "Todavía no se ha utilizado ninguna imagen. Usa «Capturar y registrar» o «Capturar y acceder».";
  } else {
    switch (phase) {
      case "registering":
        description =
          "Hemos capturado tu rostro y lo hemos registrado para futuros accesos.";
        break;
      case "verifying":
        description = "Usando esta captura para comprobar tu identidad.";
        break;
      case "success":
        description = "Identidad confirmada con la imagen mostrada.";
        break;
      case "fail":
        description =
          "No hemos podido confirmar que seas la misma persona registrada a partir de esta imagen.";
        break;
      default:
        description = "Última imagen utilizada por el sistema.";
        break;
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono text-emerald-300 uppercase tracking-widest">
        Visor del sistema
      </h2>

      <div className="relative aspect-video rounded-xl border border-emerald-500/40 bg-black/80 flex items-center justify-center overflow-hidden">
        {src ? (
          <img
            src={src}
            alt="Imagen utilizada por el sistema"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[0.7rem] text-emerald-700 font-mono text-center px-4">
            No hay ninguna imagen aún. Captura y registra o captura y accede para
            que el sistema tenga una referencia.
          </span>
        )}
      </div>

      <div className="bg-black/60 border border-emerald-500/40 rounded-lg p-3 text-xs font-mono text-emerald-300">
        {description}
      </div>
    </div>
  );
}
