import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt is required." }, { status: 400 });
    }

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    return Response.json({ text: result.text });
  } catch {
    return Response.json({ error: "Failed to generate text." }, { status: 500 });
  }
}