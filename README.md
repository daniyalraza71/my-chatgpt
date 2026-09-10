# My ChatGPT

A minimal ChatGPT-style assistant built with Next.js and the OpenAI Responses API.

## Run locally

1. Install Node.js.
2. Extract this project.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Put a NEW OpenAI API key in `.env.local`:
   `OPENAI_API_KEY=...`
6. Run `npm run dev`.
7. Open http://localhost:3000

## Security

Never put the API key in browser/client code, GitHub, screenshots, or chat messages. The key is read only by the server route.
