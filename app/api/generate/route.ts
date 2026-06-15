// Add GEMINI_API_KEY to your .env.local file

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
    const { contentIdea, platform, tone } = await req.json();

    // Basic server-side validation
    if (!contentIdea || !platform || !tone) {
      return NextResponse.json(
        { error: "Missing required fields: contentIdea, platform, and tone are required." },
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

    const systemPrompt = `You are ContentLab AI, an expert content strategist for social media creators. The user will describe their content idea. Your job is to return a content package as a JSON object with exactly these fields:
{
  "hooks": string[] (exactly 5 hooks — curiosity, emotional, contrarian, storytelling, authority. ALL hooks must be written in Tanglish [Tamil-English mix], the way Tamil Nadu college students actually talk on Instagram. Not pure English, not pure Tamil. Mixed naturally),
  "caption": string (full caption with CTA, max 150 words, written in natural Tanglish [Tamil-English mix] as used by TN students),
  "hashtags": string[] (exactly 20 hashtags, mix of niche + reach + viral),
  "bestTimeToPost": { "time": string, "reason": string },
  "thumbnailBrief": string (detailed description of thumbnail concept),
  "engagementScore": number (0-100. Be brutally honest. Score above 80 ONLY if the content has a genuinely unique, highly creative angle. Most average or cliché content should score between 55-75),
  "engagementReason": string (one sentence why this score)
}
Return ONLY the JSON object. No explanation. No markdown. No backticks.`;

    const userPrompt = `Content Idea: ${contentIdea}
Platform: ${platform}
Tone: ${tone}`;

    const { text, model } = await generateWithFallback(systemPrompt, userPrompt, apiKey);
    console.log(`Successfully generated content using model: ${model}`);

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
        { error: "Failed to parse content package JSON from AI." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("API generate route error:", error);
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
