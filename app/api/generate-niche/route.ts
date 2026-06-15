import { NextRequest, NextResponse } from "next/server";

interface ModelError {
  message: string;
  status: number;
}

async function generateWithFallback(systemPrompt: string, userPrompt: string, apiKey: string) {
  const modelCandidates = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash"];
  let lastError: ModelError | null = null;

  for (const model of modelCandidates) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: systemPrompt
            }
          ]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          return { text: textResponse, model };
        }
      } else {
        const errorText = await response.text();
        console.warn(`Model ${model} failed with status ${response.status}:`, errorText);
        try {
          const errorJson = JSON.parse(errorText);
          lastError = { 
            message: errorJson.error?.message || `API error (Status ${response.status})`, 
            status: response.status 
          };
        } catch {
          lastError = { 
            message: `API error (Status ${response.status})`, 
            status: response.status 
          };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fetch failed";
      console.warn(`Model ${model} threw fetch error:`, err);
      lastError = { message: msg, status: 500 };
    }
  }

  throw lastError || new Error("All fallback models failed to generate content.");
}

export async function POST(req: NextRequest) {
  try {
    const {
      interests,
      contentStyle,
      platform,
      audienceAge,
      location,
      language,
      timePerWeek,
      postsPerWeek
    } = await req.json();

    // Required fields check
    if (!interests || !contentStyle || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: interests, contentStyle, and platform are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "API key configuration missing on the server. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are ContentLab AI, an expert content strategist for social media creators. A new creator has shared their details. Your job is to build their complete creator identity and roadmap.

Return ONLY a JSON object with exactly these fields:
{
  "niche": string (2-4 word niche name, specific not generic),
  "nicheDescription": string (2 sentences explaining the niche),
  "nicheReason": string (1 sentence why this suits them based on their inputs),
  "contentPillars": [
    {
      "name": string,
      "description": string,
      "examples": string[] (3 post examples)
    }
  ] (exactly 3 pillars),
  "firstSevenPosts": [
    {
      "title": string,
      "format": string (Reel / Carousel / Story / Short),
      "description": string,
      "engagementPotential": string (Low / Medium / High / Viral)
    }
  ] (exactly 7 posts),
  "firstHook": string (one powerful opening hook in their language/style),
  "postingSchedule": {
    "frequency": string,
    "bestDays": string[],
    "bestTime": string,
    "reason": string
  },
  "creatorRoadmap": {
    "week1to2": string,
    "week3to4": string,
    "month2": string
  }
}

If the user selected Tanglish or Tamil as language, write hooks and post ideas in Tanglish naturally.
Be specific to their niche — not generic advice.
Return ONLY JSON. No explanation. No markdown. No backticks.`;

    const userPrompt = `Creator profile:
- Interests/Passions: ${interests}
- Content Style: ${contentStyle}
- Target Platform: ${platform}
- Target Audience Age: ${audienceAge || "Not specified"}
- Target Location: ${location || "Not specified"}
- Audience Language: ${language || "Not specified"}
- Time Available Per Week: ${timePerWeek || "Not specified"}
- Posts Per Week Goal: ${postsPerWeek || "Not specified"}`;

    const { text, model } = await generateWithFallback(systemPrompt, userPrompt, apiKey);
    console.log(`Successfully generated content niche roadmap using model: ${model}`);

    try {
      const parsedData = JSON.parse(text.trim());
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text, parseError);
      return NextResponse.json(
        { error: "Failed to parse niche package JSON from AI." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("API generate-niche route error:", error);
    // If it's our structured model error
    if (error && typeof error === "object" && "message" in error && "status" in error) {
      const modelErr = error as ModelError;
      return NextResponse.json(
        { error: modelErr.message },
        { status: modelErr.status }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
