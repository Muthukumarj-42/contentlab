import { NextRequest, NextResponse } from "next/server";

interface FalImage {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { thumbnailBrief, platform, aspectRatio } = await req.json();

    if (!thumbnailBrief) {
      return NextResponse.json({ error: "Missing thumbnailBrief parameter" }, { status: 400 });
    }

    const apiKey = process.env.FAL_API_KEY;
    if (!apiKey) {
      console.error("FAL_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "FAL_API_KEY configuration missing on the server. Please check your .env.local file." },
        { status: 500 }
      );
    }

    // Auto-detect dimensions based on platform
    let width = 1080;
    let height = 1080;
    let resolvedRatio = "1:1";

    const plat = platform?.toLowerCase() || "";
    if (plat.includes("reels") || plat.includes("shorts") || plat.includes("tiktok")) {
      width = 1080;
      height = 1920;
      resolvedRatio = "9:16";
    } else if (plat.includes("youtube")) {
      // YouTube main is 1280x720, YouTube Shorts is 1080x1920 (handled above)
      if (plat === "youtube") {
        width = 1280;
        height = 720;
        resolvedRatio = "16:9";
      } else {
        width = 1080;
        height = 1920;
        resolvedRatio = "9:16";
      }
    } else if (plat.includes("linkedin")) {
      width = 1080;
      height = 1080;
      resolvedRatio = "1:1";
    } else if (plat.includes("twitter") || plat.includes("x")) {
      width = 1200;
      height = 675;
      resolvedRatio = "16:9";
    }

    // If user overrides aspect ratio, use that instead
    if (aspectRatio && aspectRatio !== "Auto") {
      switch (aspectRatio) {
        case "9:16 Vertical":
        case "9:16":
          width = 1080;
          height = 1920;
          resolvedRatio = "9:16";
          break;
        case "16:9 Horizontal":
        case "16:9":
          width = 1280;
          height = 720;
          resolvedRatio = "16:9";
          break;
        case "1:1 Square":
        case "1:1":
          width = 1080;
          height = 1080;
          resolvedRatio = "1:1";
          break;
        case "4:5 Portrait":
        case "4:5":
          width = 1080;
          height = 1350;
          resolvedRatio = "4:5";
          break;
        default:
          break;
      }
    }

    console.log(`Generating thumbnail using FAL.ai with prompt: "${thumbnailBrief}" and size: ${width}x${height} (${resolvedRatio})`);

    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `${thumbnailBrief} Professional social media thumbnail. High quality. Vibrant colors. Eye-catching.`,
        image_size: { width, height },
        num_inference_steps: 4,
        num_images: 2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`fal.ai API call failed with status ${response.status}:`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.detail) {
          return NextResponse.json({ error: errorJson.detail }, { status: response.status });
        }
      } catch {
        // use fallback below
      }
      return NextResponse.json(
        { error: `fal.ai API call failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data.images || !Array.isArray(data.images)) {
      console.error("Unexpected fal.ai response structure:", JSON.stringify(data));
      return NextResponse.json({ error: "Invalid response structure from fal.ai" }, { status: 500 });
    }

    const urls = data.images.map((img: FalImage) => img.url);

    return NextResponse.json({
      urls,
      resolvedRatio,
      dimensions: `${width}×${height}`
    });

  } catch (error: unknown) {
    console.error("API thumbnail route error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
