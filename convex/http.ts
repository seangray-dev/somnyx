import { httpRouter } from "convex/server";
import OpenAI from "openai";

import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { httpAction } from "./_generated/server";
import { SYSTEM_PROMPT } from "./util";

const http = httpRouter();

function hasDelimiter(response: string) {
  return (
    response.includes("\n") ||
    response.includes(".") ||
    response.includes("?") ||
    response.includes("!") ||
    response.includes(",") ||
    response.length > 100
  );
}

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature: string = request.headers.get("stripe-signature") as string;

    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/stripe/authorize",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature: string = request.headers.get("stripe-signature") as string;

    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            userId: result.data.id,
            email: result.data.email_addresses[0]?.email_address,
            first_name: result.data.first_name || "",
            last_name: result.data.last_name || "",
            profileImage: result.data.image_url,
          });
          break;
        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            userId: result.data.id,
            profileImage: result.data.image_url,
          });
          break;
        case "user.deleted":
          await ctx.runMutation(internal.users.deleteUser, {
            userId: result.data.id!,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const messageId: Id<"messages"> = body.messageId;
      const messages: Doc<"messages">[] = body.messages;

      // Create streaming response
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const textEncoder = new TextEncoder();
      let content = "";

      const streamData = async () => {
        try {
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });

          const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              ...messages.map(
                ({ body, author }) =>
                  ({
                    role: author === "AI" ? "assistant" : "user",
                    content: body,
                  }) as const
              ),
            ],
            stream: true,
          });

          for await (const part of stream) {
            const text = part.choices[0]?.delta?.content || "";
            content += text;
            await writer.write(textEncoder.encode(text));

            // Update message when we hit natural language boundaries
            if (hasDelimiter(text)) {
              await ctx.runMutation(internal.mutations.message.update, {
                messageId,
                body: content,
                isComplete: false,
              });
            }
          }

          // Final update
          await ctx.runMutation(internal.mutations.message.update, {
            messageId,
            body: content,
            isComplete: true,
          });
        } catch (error) {
          console.error("Stream error:", error);
          const errorMessage =
            error instanceof OpenAI.APIError
              ? `OpenAI error: ${error.message}`
              : "An error occurred while processing your dream.";

          await ctx.runMutation(internal.mutations.message.update, {
            messageId,
            body: errorMessage,
            isComplete: true,
          });

          await writer.write(textEncoder.encode(errorMessage));
        } finally {
          await writer.close();
        }
      };

      // Start streaming
      void streamData();

      await ctx.runAction(internal.mutations.openai.determineDreamThemesFree, {
        details: content,
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          Vary: "origin",
        },
      });
    } catch (error) {
      console.error("Error in /chat handler:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Vary: "origin",
        },
      });
    }
  }),
});

http.route({
  path: "/chat",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
