"use client";

import { IdentifyStatus } from "@/app/page";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ResultView({
  status,
  onRetry,
}: {
  status: IdentifyStatus;
  onRetry: () => void;
}) {
  const ok = status === "ok";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-between">
          <h1 className="text-xl font-semibold">
            {ok ? "Acceso concedido" : "Acceso denegado"}
          </h1>
          <Badge className={ok ? "bg-green-500" : "bg-red-500"}>
            {ok ? "OK" : "FAIL"}
          </Badge>
        </CardHeader>

        <CardContent>
          {ok
            ? "Tu identidad ha sido verificada."
            : "No se ha podido verificar tu identidad."}
        </CardContent>

        <CardFooter>
          <Button onClick={onRetry}>Reintentar</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
