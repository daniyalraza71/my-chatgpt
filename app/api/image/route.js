import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: "HF_TOKEN is missing in .env.local" },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Please provide an image prompt." },
        { status: 400 }
      );
    }

    const client = new InferenceClient(process.env.HF_TOKEN);

    const image = await client.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      provider: "auto",
    });

    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    console.error("Hugging Face image error:", error);

    return NextResponse.json(
      {
        error:
          error?.message || "Image generation failed.",
      },
      { status: 500 }
    );
  }
}