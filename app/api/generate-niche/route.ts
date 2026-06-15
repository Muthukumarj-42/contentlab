import { NextRequest, NextResponse } from "next/server";

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API call failed with status ${response.status}:`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          return NextResponse.json(
            { error: errorJson.error.message },
            { status: response.status }
          );
        }
      } catch {
        // ignore
      }
      return NextResponse.json(
        { error: `Gemini API error (Status ${response.status}): Failed to generate creator niche roadmap.` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error("Empty content in Gemini response:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Invalid response layout received from AI generator." },
        { status: 500 }
      );
    }

    try {
      const parsedData = JSON.parse(textResponse.trim());
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", textResponse, parseError);
      return NextResponse.json(
        { error: "Failed to parse niche package JSON from AI." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("API generate-niche route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
