import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { thumbnailBrief, platform, aspectRatio } = await req.json();

    if (!thumbnailBrief) {
      return NextResponse.json(
        { error: "Missing thumbnailBrief parameter" },
        { status: 400 },
      );
    }

    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
      console.error("HF_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        {
          error:
            "HF_API_KEY configuration missing on the server. Please add HF_API_KEY to your .env.local file.",
        },
        { status: 500 },
      );
    }

    // Determine target dimensions based on platform or aspect ratio override
    let imageWidth = 1280;
    let imageHeight = 720;
    let resolvedRatio = "16:9";

    const plat = platform?.toLowerCase() || "";

    // 1. Base default dimensions from platform selection
    if (plat.includes("reels") || plat === "instagram reels") {
      imageWidth = 1080;
      imageHeight = 1920;
      resolvedRatio = "9:16";
    } else if (plat.includes("shorts") || plat === "youtube shorts") {
      imageWidth = 1080;
      imageHeight = 1920;
      resolvedRatio = "9:16";
    } else if (plat === "youtube" || plat.includes("youtube")) {
      imageWidth = 1280;
      imageHeight = 720;
      resolvedRatio = "16:9";
    } else if (plat.includes("linkedin")) {
      imageWidth = 1080;
      imageHeight = 1080;
      resolvedRatio = "1:1";
    } else if (plat.includes("twitter") || plat.includes("x")) {
      imageWidth = 1200;
      imageHeight = 675;
      resolvedRatio = "16:9";
    } else if (plat.includes("tiktok")) {
      imageWidth = 1080;
      imageHeight = 1920;
      resolvedRatio = "9:16";
    } else {
      imageWidth = 1080;
      imageHeight = 1080;
      resolvedRatio = "1:1";
    }

    // 2. Aspect Ratio override overrides platform default
    if (aspectRatio && aspectRatio !== "Auto") {
      if (aspectRatio.includes("9:16")) {
        imageWidth = 1080;
        imageHeight = 1920;
        resolvedRatio = "9:16";
      } else if (aspectRatio.includes("16:9")) {
        imageWidth = 1280;
        imageHeight = 720;
        resolvedRatio = "16:9";
      } else if (aspectRatio.includes("1:1")) {
        imageWidth = 1080;
        imageHeight = 1080;
        resolvedRatio = "1:1";
      } else if (aspectRatio.includes("4:5")) {
        imageWidth = 1080;
        imageHeight = 1350;
        resolvedRatio = "4:5";
      }
    }

    // Determine platform mood
    let platformMood = "";
    if (plat.includes("reels") || plat.includes("instagram")) {
      platformMood =
        "warm sunset gradient background, coral to amber, vibrant South Indian aesthetic";
    } else if (plat.includes("shorts")) {
      platformMood =
        "dramatic split lighting, deep shadows, high contrast, cinematic grade";
    } else if (plat.includes("youtube")) {
      platformMood =
        "bold dramatic lighting, slightly oversaturated colors, Netflix poster quality";
    } else if (plat.includes("linkedin")) {
      platformMood =
        "clean professional environment, soft natural light, corporate editorial";
    } else if (plat.includes("tiktok")) {
      platformMood =
        "high energy, bright background, gen-z aesthetic, neon accent tones";
    } else if (plat.includes("twitter") || plat.includes("x")) {
      platformMood = "moody editorial, desaturated film look";
    } else {
      platformMood = "professional social media aesthetic";
    }

    const imageOnlyPrompt = `
${thumbnailBrief},
cinematic photography, dramatic lighting,
rule of thirds composition,
large empty zone at top 30% for text overlay,
large empty zone at bottom 20% for text overlay,
subject fills center and right side of frame,
${platformMood},
high contrast between subject and background,
sharp focus, professional commercial photography,
Sony A7IV 85mm lens, golden hour lighting,
NO TEXT, NO WORDS, NO LETTERS, NO WATERMARKS,
NO LOGOS, NO TYPOGRAPHY anywhere in image,
clean negative space for text placement,
ABSOLUTELY NO TEXT. ABSOLUTELY NO WORDS. 
ABSOLUTELY NO LETTERS. ABSOLUTELY NO NUMBERS. 
CLEAN IMAGE ONLY. ANY TEXT IN IMAGE = FAIL.
`.trim();

    console.log(
      `Calling Hugging Face FLUX.1-dev with size: ${imageWidth}x${imageHeight} (${resolvedRatio})`,
    );

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true",
        },
        body: JSON.stringify({
          inputs: imageOnlyPrompt,
          parameters: {
            width: imageWidth,
            height: imageHeight,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            negative_prompt:
              "text, words, letters, watermark, logo, signature, caption, typography, font, writing, label, subtitle, title, heading, numbers, symbols, characters, alphabets",
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Hugging Face API call failed with status ${response.status}:`,
        errorText,
      );
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          return NextResponse.json(
            { error: errorJson.error },
            { status: response.status },
          );
        }
      } catch {}
      return NextResponse.json(
        {
          error: `Hugging Face API call failed with status ${response.status}`,
        },
        { status: response.status },
      );
    }

    const imageBlob = await response.blob();
    const buffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = "image/jpeg";

    return NextResponse.json({
      image: `data:${mimeType};base64,${base64}`,
      resolvedRatio,
      dimensions: `${imageWidth}×${imageHeight}`,
    });
  } catch (error: unknown) {
    console.error("API thumbnail route error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
