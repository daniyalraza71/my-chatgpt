import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Frontend handles either { prompt: "text" }, { message: "text" }, or { messages: [...] }
    let rawMessages = [];
    if (Array.isArray(body.messages)) {
      rawMessages = body.messages;
    } else if (body.prompt || body.message || body.text) {
      rawMessages = [{ role: "user", content: body.prompt || body.message || body.text }];
    }

    if (rawMessages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const input = rawMessages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "You are My AI, a helpful, concise and professional personal assistant. Maintain conversation context and answer naturally.",
      input,
    });

    return NextResponse.json({
      message: response.output_text || "I couldn't generate a response.",
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "OpenAI request failed. Please check your API key and project.",
      },
      { status: 500 }
    );
  }
}