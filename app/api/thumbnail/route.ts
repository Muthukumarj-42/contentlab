import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { thumbnailBrief, platform, aspectRatio } = await req.json();

    if (!thumbnailBrief) {
      return NextResponse.json({ error: "Missing thumbnailBrief parameter" }, { status: 400 });
    }

    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
      console.error("HF_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "HF_API_KEY configuration missing on the server. Please add HF_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // Determine target dimensions based on platform or aspect ratio override
    let imageWidth = 1280;
    let imageHeight = 720;
    let resolvedRatio = "16:9";

    const plat = platform?.toLowerCase() || "";
    
    // 1. Base default dimensions from platform selection
    if (plat.includes("reels") || plat.includes("shorts") || plat.includes("tiktok")) {
      imageWidth = 1080;
      imageHeight = 1920;
      resolvedRatio = "9:16";
    } else if (plat.includes("youtube")) {
      // Main YouTube is 1280x720, YouTube Shorts is 1080x1920 (handled above)
      if (plat === "youtube") {
        imageWidth = 1280;
        imageHeight = 720;
        resolvedRatio = "16:9";
      } else {
        imageWidth = 1080;
        imageHeight = 1920;
        resolvedRatio = "9:16";
      }
    } else if (plat.includes("linkedin") || plat.includes("twitter") || plat.includes("x")) {
      imageWidth = 1200;
      imageHeight = 675;
      resolvedRatio = "16:9";
    } else {
      // General post default
      imageWidth = 1080;
      imageHeight = 1080;
      resolvedRatio = "1:1";
    }

    // 2. Aspect Ratio override overrides platform default
    if (aspectRatio && aspectRatio !== "Auto") {
      switch (aspectRatio) {
        case "9:16 Vertical":
        case "9:16":
          imageWidth = 1080;
          imageHeight = 1920;
          resolvedRatio = "9:16";
          break;
        case "16:9 Horizontal":
        case "16:9":
          imageWidth = 1280;
          imageHeight = 720;
          resolvedRatio = "16:9";
          break;
        case "1:1 Square":
        case "1:1":
          imageWidth = 1080;
          imageHeight = 1080;
          resolvedRatio = "1:1";
          break;
        case "4:5 Portrait":
        case "4:5":
          imageWidth = 1080;
          imageHeight = 1350;
          resolvedRatio = "4:5";
          break;
        default:
          break;
      }
    }

    // Determine color schemes
    let platformColorScheme = "vibrant colors, dramatic lighting";
    if (plat.includes("instagram")) {
      platformColorScheme = "warm sunset tones, coral and amber palette";
    } else if (plat.includes("youtube")) {
      platformColorScheme = "high contrast, bold reds and whites, dramatic lighting";
    } else if (plat.includes("linkedin")) {
      platformColorScheme = "professional blues and whites, clean corporate feel";
    } else if (plat.includes("tiktok")) {
      platformColorScheme = "neon accents, dark background, gen-z aesthetic";
    } else if (plat.includes("twitter") || plat.includes("x")) {
      platformColorScheme = "monochromatic, high contrast black and white";
    }

    const aspectRatioStyle = resolvedRatio === "9:16" 
      ? "vertical framing, portrait orientation" 
      : resolvedRatio === "16:9" 
      ? "horizontal framing, landscape orientation" 
      : "square composition";

    const enhancedPrompt = `
      ${thumbnailBrief}, 
      professional social media thumbnail design,
      rule of thirds composition,
      bold typography placement zone in upper third,
      high contrast between subject and background,
      cinematic color grading,
      ${platformColorScheme},
      sharp focus on main subject,
      negative space for text overlay,
      no watermarks, no logos, no text in image,
      shot on Sony A7IV, 85mm lens,
      commercial photography quality,
      vibrant but not oversaturated,
      ${aspectRatioStyle}
    `.trim().replace(/\s+/g, ' ');

    console.log(`Calling Hugging Face FLUX.1-schnell with size: ${imageWidth}x${imageHeight} (${resolvedRatio})`);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true"
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            width: imageWidth,
            height: imageHeight,
            num_inference_steps: 4,
            guidance_scale: 0.0
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API call failed with status ${response.status}:`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          return NextResponse.json({ error: errorJson.error }, { status: response.status });
        }
      } catch {}
      return NextResponse.json(
        { error: `Hugging Face API call failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const imageBlob = await response.blob();
    const buffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = 'image/jpeg';
    
    return NextResponse.json({ 
      image: `data:${mimeType};base64,${base64}`,
      resolvedRatio,
      dimensions: `${imageWidth}×${imageHeight}`
    });

  } catch (error: unknown) {
    console.error("API thumbnail route error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
