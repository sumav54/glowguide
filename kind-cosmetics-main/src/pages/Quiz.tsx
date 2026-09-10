import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { quizQuestions, skinTypeInfo, SkinType } from "@/data/products";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<SkinType[]>([]);
  const [result, setResult] = useState<SkinType | null>(null);

  const handleAnswer = (skinType: SkinType) => {
    const newAnswers = [...answers, skinType];
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate most frequent answer
      const counts: Record<string, number> = {};
      newAnswers.forEach((a) => (counts[a] = (counts[a] || 0) + 1));
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as SkinType;
      setResult(winner);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const info = result ? skinTypeInfo[result] : null;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-2"
        >
          Skin Type Quiz
        </motion.h1>
        <p className="text-muted-foreground text-center mb-12">Answer a few questions to discover your skin type</p>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= currentQ ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  Question {currentQ + 1} of {quizQuestions.length}
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">
                  {quizQuestions[currentQ].question}
                </h2>

                <div className="grid gap-3">
                  {quizQuestions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.skinType)}
                      className="text-left p-5 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <span className="text-foreground group-hover:text-primary transition-colors">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {info && <img src={info.image} alt={`${info.title} example`} width={768} height={960} className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-background shadow-lg" />}
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{info?.title}</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">{info?.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-10 text-left">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-display text-lg font-semibold mb-3">Characteristics</h3>
                    <ul className="space-y-2">
                      {info?.characteristics.map((c) => (
                        <li key={c} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-display text-lg font-semibold mb-3">Skincare Tips</h3>
                    <ul className="space-y-2">
                      {info?.tips.map((t) => (
                        <li key={t} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={restart} variant="outline" className="rounded-full px-6">
                    <RotateCcw className="mr-2 w-4 h-4" /> Retake Quiz
                  </Button>
                  <Button onClick={() => navigate(`/products?skin=${result}`)} className="rounded-full px-6">
                    See My Products <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
