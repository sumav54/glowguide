import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert dermatologist AI assistant. Analyze the skin in the provided photo and provide:
1. Detected skin type (one of: oily, dry, normal, combination)
2. Observed skin concerns (e.g., acne, dark spots, fine lines, redness, enlarged pores, dehydration)
3. Recommended treatments and skincare routine (morning and night)
4. Specific product ingredient recommendations
5. Lifestyle tips for their skin type

IMPORTANT: Always include a disclaimer that this is AI-assisted analysis and not a substitute for professional dermatological advice.

Respond ONLY with valid JSON (no markdown code fences) in exactly this structure:
{
  "skinType": "oily|dry|normal|combination",
  "confidence": "high|medium|low",
  "concerns": ["concern1", "concern2"],
  "analysis": "detailed text analysis of what you observe",
  "morningRoutine": ["step1", "step2", "step3"],
  "nightRoutine": ["step1", "step2", "step3"],
  "recommendedIngredients": ["ingredient1", "ingredient2"],
  "lifestyleTips": ["tip1", "tip2"],
  "disclaimer": "This is an AI-assisted analysis..."
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strip a data URL prefix if the client sent one (Gemini wants raw base64 only).
    const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: SYSTEM_PROMPT + "\n\nPlease analyze my skin from this photo and provide skincare recommendations." },
                { inline_data: { mime_type: "image/jpeg", data: cleanBase64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402 || response.status === 403) {
        return new Response(JSON.stringify({ error: "Usage limit reached or invalid API key." }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gemini API error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to parse JSON from the response
    let result;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch {
      result = {
        skinType: "normal",
        confidence: "low",
        concerns: [],
        analysis: content,
        morningRoutine: [],
        nightRoutine: [],
        recommendedIngredients: [],
        lifestyleTips: [],
        disclaimer: "This is an AI-assisted analysis and should not replace professional dermatological advice.",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-skin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
