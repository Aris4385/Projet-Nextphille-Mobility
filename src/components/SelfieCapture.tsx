"use client";

import { useEffect, useRef, useState } from "react";

export default function SelfieCapture({
  onCapture,
}: {
  onCapture: (file: File) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");
  const [pret, setPret] = useState(false);

  async function demarrerCamera() {
    setErreur("");
    setPret(false);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(s);
    } catch (e) {
      setErreur("Impossible d'acceder a la camera. Verifiez les autorisations.");
    }
  }

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {
        setErreur("Impossible de lancer la video.");
      });
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  function capturer() {
    setErreur("");
    try {
      if (!videoRef.current || !canvasRef.current) {
        setErreur("Camera pas encore prete, patientez une seconde.");
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video.videoWidth || !video.videoHeight) {
        setErreur("Camera pas encore prete, patientez une seconde et reessayez.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setErreur("Erreur technique (canvas).");
        return;
      }
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setErreur("Echec de la capture, reessayez.");
            return;
          }
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          setPhoto(URL.createObjectURL(blob));
          onCapture(file);
          stream?.getTracks().forEach((t) => t.stop());
          setStream(null);
        },
        "image/jpeg",
        0.9
      );
    } catch (e) {
      setErreur("Erreur pendant la capture : " + (e as Error).message);
    }
  }

  function reprendre() {
    setPhoto(null);
    demarrerCamera();
  }

  return (
    <div>
      {!stream && !photo && (
        <button
          type="button"
          onClick={demarrerCamera}
          className="w-full rounded-lg bg-forest px-4 py-3 text-sm text-ivory ring-1 ring-sage/20 transition hover:ring-gold"
        >
          Ouvrir la camera
        </button>
      )}

      {stream && !photo && (
        <div className="flex flex-col gap-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setPret(true)}
            className="w-full rounded-lg"
          />
          <button
            type="button"
            onClick={capturer}
            disabled={!pret}
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-forest transition hover:bg-goldSoft disabled:opacity-50"
          >
            {pret ? "Prendre la photo" : "Chargement de la camera..."}
          </button>
        </div>
      )}

      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <div className="flex flex-col gap-3">
          <img src={photo} alt="Selfie" className="w-full rounded-lg" />
          <button
            type="button"
            onClick={reprendre}
            className="text-sm text-gold hover:text-goldSoft"
          >
            Reprendre la photo
          </button>
        </div>
      )}

      {erreur && <p className="mt-2 text-sm text-red-400">{erreur}</p>}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
