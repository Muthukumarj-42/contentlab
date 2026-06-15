import { NextRequest, NextResponse } from "next/server";

interface ModelError {
  message: string;
  status: number;
}

function escapeUnescapedQuotes(jsonStr: string): string {
  let insideString = false;
  let escaped = false;
  let result = '';
  
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    
    if (char === '\\') {
      escaped = !escaped;
      result += char;
      continue;
    }
    
    if (char === '\n' && insideString) {
      result += '\\n';
      continue;
    }
    
    if (char === '\r' && insideString) {
      result += '\\r';
      continue;
    }
    
    if (char === '"') {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }
      
      if (insideString) {
        let isStructural = false;
        let j = i + 1;
        while (j < jsonStr.length && /\s/.test(jsonStr[j])) {
          j++;
        }
        if (j < jsonStr.length) {
          const nextChar = jsonStr[j];
          if (nextChar === ',' || nextChar === ']' || nextChar === '}' || nextChar === ':') {
            isStructural = true;
          }
        } else {
          isStructural = true;
        }
        
        if (isStructural) {
          insideString = false;
        } else {
          result += '\\';
        }
      } else {
        insideString = true;
      }
    }
    
    result += char;
    escaped = false;
  }
  return result;
}

async function generateWithFallback(systemPrompt: string, userPrompt: string, apiKey: string) {
  const modelCandidates = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash"
  ];
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
      niche,
      platform,
      struggle,
      followerCount,
      contentTried,
      language
    } = await req.json();

    // Required fields check
    if (!niche || !platform || !struggle) {
      return NextResponse.json(
        { error: "Missing required fields: niche, platform, and struggle are required." },
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

    const systemPrompt = `You are ContentLab AI, an expert content strategist. A creator is stuck and needs help. Diagnose their real problem and give them an actionable content plan.

Return ONLY a JSON object with exactly these fields:
{
  "diagnosis": string (2-3 sentences, specific diagnosis of their problem),
  "trendingAngles": [
    {
      "angleName": string,
      "whyItWorks": string,
      "examplePost": string,
      "hook": string
    }
  ] (exactly 5 angles),
  "fullScript": {
    "hook": string,
    "middle": string,
    "cta": string
  },
  "contentMix": [
    {
      "type": string,
      "percentage": number,
      "reason": string
    }
  ] (3-4 content types, percentages add up to 100),
  "quickWin": {
    "format": string,
    "hook": string,
    "caption": string,
    "hashtags": string[] (15 hashtags)
  },
  "sevenDayPlan": [
    {
      "day": number,
      "postType": string,
      "topic": string,
      "format": string
    }
  ] (exactly 7 days)
}

If language is Tamil or Tanglish, write hooks, scripts and captions in Tanglish naturally.
Be brutally specific to their niche. No generic advice.
Return ONLY JSON. No explanation. No markdown. No backticks.`;

    const userPrompt = `Creator profile:
- Niche: ${niche}
- Platform: ${platform}
- Biggest Struggle: ${struggle}
- Current Follower Count: ${followerCount || "Not specified"}
- Types of Content Tried: ${contentTried ? (Array.isArray(contentTried) ? contentTried.join(", ") : contentTried) : "Not specified"}
- Content Language: ${language || "Not specified"}`;

    const { text, model } = await generateWithFallback(systemPrompt, userPrompt, apiKey);
    console.log(`Successfully generated stuck content ideas using model: ${model}`);

    try {
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
      }
      const parsedData = JSON.parse(escapeUnescapedQuotes(cleanedText));
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text, parseError);
      return NextResponse.json(
        { error: "Failed to parse ideas diagnostic package JSON from AI." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("API generate-ideas route error:", error);
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
