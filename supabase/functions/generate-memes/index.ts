import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore[ip];

  if (!limit || now > limit.resetTime) {
    rateLimitStore[ip] = { count: 1, resetTime: now + 60000 };
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

const prompts = [
  "Create a meme-style variation of this logo in a luxurious setting with gold chains, stacks of money, and diamond bling around it. Keep the green neon RR logo as the central focus. Internet meme aesthetic with vibrant lighting and wealth symbols.",
  "Create a dramatic cinematic variation of this logo on top of a mountain of cash and cryptocurrency coins, with epic volumetric lighting and a moody atmosphere. The RR logo should be glowing and victorious. Professional photography style with depth.",
  "Create a surreal absurd meme variation of this logo floating in space surrounded by rocket ships, Bitcoin symbols, and moon imagery. Keep the neon green RR logo style but make it cosmic and trippy with psychedelic colors. Internet culture aesthetic."
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait before generating more memes." }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      const placeholderImages = [
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMyMmM1NWUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HZW1pbmkgTWVtZSAxPC90ZXh0Pjwvc3ZnPg==",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMyMmM1NWUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HZW1pbmkgTWVtZSAyPC90ZXh0Pjwvc3ZnPg==",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMyMmM1NWUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HZW1pbmkgTWVtZSAzPC90ZXh0Pjwvc3ZnPg=="
      ];

      return new Response(
        JSON.stringify({ images: placeholderImages }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const referenceImageUrl = "https://zapbhictjoieagrivegb.supabase.co/storage/v1/object/public/images/johnny_pfp_(12).png";

    let referenceImageBase64 = "";
    try {
      const imgResponse = await fetch(referenceImageUrl);
      if (imgResponse.ok) {
        const blob = await imgResponse.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        referenceImageBase64 = btoa(String.fromCharCode(...bytes));
      }
    } catch (error) {
      console.error("Failed to fetch reference image:", error);
    }

    const generatedImages: string[] = [];

    for (let i = 0; i < 3; i++) {
      const requestBody: any = {
        instances: [
          {
            prompt: prompts[i]
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          negativePrompt: "text, words, captions, watermark, low quality, blurry, different logo",
          safetyFilterLevel: "block_some",
          personGeneration: "allow_adult"
        }
      };

      if (referenceImageBase64) {
        requestBody.instances[0].referenceImages = [
          {
            bytesBase64Encoded: referenceImageBase64,
            referenceType: "STYLE"
          }
        ];
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        console.error(`Gemini API error for image ${i + 1}:`, await response.text());
        throw new Error(`Failed to generate image ${i + 1}`);
      }

      const result = await response.json();

      if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
        generatedImages.push(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
      } else {
        throw new Error(`Invalid response format for image ${i + 1}`);
      }
    }

    return new Response(
      JSON.stringify({ images: generatedImages }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error generating memes:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate memes. Please try again."
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
