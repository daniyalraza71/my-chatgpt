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
        { error: "OPENAI_API_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    // OpenRouter Connection Setup
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
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

    // Add System Instruction
    const messages = [
      {
        role: "system",
        content: "You are My AI, a helpful, concise and professional personal assistant. Maintain conversation context and answer naturally.",
      },
      ...input,
    ];

    // OpenRouter Free Chat Completion Request
    const response = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: messages,
    });

    const outputText = response.choices[0]?.message?.content || "I couldn't generate a response.";

    return NextResponse.json({
      message: outputText,
    });

  } catch (error) {
    console.error("OPENROUTER ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "OpenRouter request failed. Please check your API key.",
      },
      { status: 500 }
    );
  }
}