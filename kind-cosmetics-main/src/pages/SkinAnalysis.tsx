import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw, ArrowRight, Loader2, AlertTriangle, Sun, Moon, Lightbulb, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { SkinType } from "@/data/products";

interface AnalysisResult {
  skinType: SkinType;
  confidence: string;
  concerns: string[];
  analysis: string;
  morningRoutine: string[];
  nightRoutine: string[];
  recommendedIngredients: string[];
  lifestyleTips: string[];
  disclaimer: string;
}

const SkinAnalysis = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"choose" | "camera" | "preview" | "analyzing" | "result">("choose");
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported here. Open the app on localhost or HTTPS, or upload a photo instead.");
      return;
    }

    try {
      let mediaStream: MediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setStream(mediaStream);
      setMode("camera");
    } catch (cameraError) {
      const name = cameraError instanceof DOMException ? cameraError.name : "";
      const message = name === "NotAllowedError" || name === "PermissionDeniedError"
        ? "Camera permission was denied. Allow camera access in your browser settings, then try again."
        : name === "NotFoundError"
          ? "No camera was found. Connect a camera or upload a photo instead."
          : "Unable to start the camera. Check that it is not being used by another app, then try again.";
      setError(message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (mode !== "camera" || !stream || !videoRef.current) return;

    videoRef.current.srcObject = stream;
    void videoRef.current.play().catch(() => {
      setError("Unable to start the camera preview. Please check your browser camera permissions.");
    });

    return () => {
      videoRef.current?.pause();
      videoRef.current?.removeAttribute("src");
      videoRef.current?.load();
    };
  }, [mode, stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL("image/jpeg", 0.8);
      setImageData(data);
      stopCamera();
      setMode("preview");
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target?.result as string);
      setMode("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!imageData) return;
    setMode("analyzing");
    setError(null);

    try {
      const base64 = imageData.split(",")[1];
      const { data, error: fnError } = await supabase.functions.invoke("analyze-skin", {
        body: { imageBase64: base64 },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setMode("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setMode("preview");
    }
  }, [imageData]);

  const restart = () => {
    stopCamera();
    setMode("choose");
    setImageData(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-2"
        >
          AI Skin Analysis
        </motion.h1>
        <p className="text-muted-foreground text-center mb-12">
          Take a photo or upload one to get personalized skin analysis & treatment recommendations
        </p>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* CHOOSE MODE */}
            {mode === "choose" && (
              <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <button
                  onClick={startCamera}
                  className="w-full p-8 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-center group"
                >
                  <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="font-display text-xl font-semibold mb-1">Take a Selfie</h3>
                  <p className="text-sm text-muted-foreground">Use your camera for instant skin analysis</p>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-center group"
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="font-display text-xl font-semibold mb-1">Upload a Photo</h3>
                  <p className="text-sm text-muted-foreground">Upload an existing photo for analysis</p>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-2"><Lightbulb className="w-4 h-4" /> For best results: Use natural lighting, no makeup, face the camera directly</p>
                </div>
              </motion.div>
            )}

            {/* CAMERA */}
            {mode === "camera" && (
              <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="rounded-xl overflow-hidden bg-black relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full" />
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-xl pointer-events-none" />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => { stopCamera(); setMode("choose"); }} variant="outline" className="rounded-full">Cancel</Button>
                  <Button onClick={capturePhoto} className="rounded-full px-8"><Camera className="mr-2 w-4 h-4" /> Capture</Button>
                </div>
              </motion.div>
            )}

            {/* PREVIEW */}
            {mode === "preview" && imageData && (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden">
                  <img src={imageData} alt="Captured" className="w-full" />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={restart} variant="outline" className="rounded-full"><RotateCcw className="mr-2 w-4 h-4" /> Retake</Button>
                  <Button onClick={analyzeImage} className="rounded-full px-8">Analyze My Skin <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {/* ANALYZING */}
            {mode === "analyzing" && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                <h3 className="font-display text-2xl font-semibold mb-2">Analyzing Your Skin...</h3>
                <p className="text-muted-foreground">Our AI dermatologist is examining your photo</p>
              </motion.div>
            )}

            {/* RESULT */}
            {mode === "result" && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="text-center">
                  <ScanFace className="w-14 h-14 mx-auto mb-3 text-primary" />
                  <h2 className="font-display text-3xl font-bold capitalize mb-1">{result.skinType} Skin</h2>
                  <p className="text-sm text-muted-foreground">Confidence: {result.confidence}</p>
                </div>

                {/* Analysis */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-display text-lg font-semibold mb-3">Analysis</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
                </div>

                {/* Concerns */}
                {result.concerns?.length > 0 && (
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-display text-lg font-semibold mb-3">Skin Concerns Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.concerns.map((c) => (
                        <span key={c} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Routines */}
                <div className="grid md:grid-cols-2 gap-4">
                  {result.morningRoutine?.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2"><Sun className="w-5 h-5 text-primary" /> Morning Routine</h3>
                      <ol className="space-y-2">
                        {result.morningRoutine.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {result.nightRoutine?.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2"><Moon className="w-5 h-5 text-primary" /> Night Routine</h3>
                      <ol className="space-y-2">
                        {result.nightRoutine.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {result.recommendedIngredients?.length > 0 && (
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-display text-lg font-semibold mb-3">Recommended Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.recommendedIngredients.map((ing) => (
                        <span key={ing} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lifestyle Tips */}
                {result.lifestyleTips?.length > 0 && (
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-display text-lg font-semibold mb-3">Lifestyle Tips</h3>
                    <ul className="space-y-2">
                      {result.lifestyleTips.map((t) => (
                        <li key={t} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground text-center">{result.disclaimer}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center pt-2">
                  <Button onClick={restart} variant="outline" className="rounded-full px-6">
                    <RotateCcw className="mr-2 w-4 h-4" /> Analyze Again
                  </Button>
                  <Button onClick={() => navigate(`/products?skin=${result.skinType}`)} className="rounded-full px-6">
                    See Products <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button onClick={() => navigate(`/routine-builder?skin=${result.skinType}`)} variant="outline" className="rounded-full px-6">
                    Build Routine <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default SkinAnalysis;
