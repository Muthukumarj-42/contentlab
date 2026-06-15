import { NextRequest, NextResponse } from "next/server";

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
        { error: `Gemini API error (Status ${response.status}): Failed to generate content diagnostics.` },
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
        { error: "Failed to parse ideas diagnostic package JSON from AI." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("API generate-ideas route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
