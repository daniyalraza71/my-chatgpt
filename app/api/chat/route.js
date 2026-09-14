import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

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

    // Dynamic current date & time injection
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const messages = [
      {
        role: "system",
        content: `You are My AI, a helpful, concise and professional personal assistant built and owned by Daniyal. Today's date is ${currentDate}. Maintain conversation context and answer naturally. 
        CRITICAL RULE: If anyone asks who built you, who created you, who is your owner, or anything related to your creator/developer, you must always and strictly state that you were built and created by Daniyal. Never mention OpenAI, OpenRouter, Meta, Qwen, or Google as your creator.`,
      },
      ...input,
    ];

   // OpenRouter Auto-Fallback Models Array (Working Free Models Only)
    const response = await client.chat.completions.create({
      model: "openrouter/auto",
      models: [
        "qwen/qwen-2.5-coder-32b-instruct:free",
        "meta-llama/llama-3.1-8b-instruct:free",
        "google/gemma-2-9b-it:free"
      ],
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