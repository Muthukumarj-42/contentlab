// Add GEMINI_API_KEY to your .env.local file

import { NextRequest, NextResponse } from "next/server";

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are ContentLab AI, an expert content strategist for social media creators. The user will describe their content idea. Your job is to return a content package as a JSON object with exactly these fields:
{
  "hooks": string[] (exactly 5 hooks — curiosity, emotional, contrarian, storytelling, authority),
  "caption": string (full caption with CTA, max 150 words),
  "hashtags": string[] (exactly 20 hashtags, mix of niche + reach + viral),
  "bestTimeToPost": { "time": string, "reason": string },
  "thumbnailBrief": string (detailed description of thumbnail concept),
  "engagementScore": number (0-100),
  "engagementReason": string (one sentence why this score)
}
Return ONLY the JSON object. No explanation. No markdown. No backticks.`;

    const userPrompt = `Content Idea: ${contentIdea}
Platform: ${platform}
Tone: ${tone}`;

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
      return NextResponse.json(
        { error: "Failed to generate content package from Gemini API." },
        { status: 500 }
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
        { error: "Failed to parse content package JSON from AI." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("API generate route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
