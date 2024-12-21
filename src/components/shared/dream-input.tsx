"use client";

import { useEffect, useState } from "react";

import { useMutation, useQuery } from "convex/react";
import { ArrowUpIcon } from "lucide-react";

import { env } from "@/config/env/client";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SpeechToTextButton from "./speech-to-text-button";

export default function DreamInput() {
  const [conversationId, setConversationId] = useState<string>("");

  useEffect(() => {
    const storedId = localStorage.getItem("dreamConversationId");
    const newId = storedId || crypto.randomUUID();
    if (!storedId) {
      localStorage.setItem("dreamConversationId", newId);
    }
    setConversationId(newId);
  }, []);

  const messages = useQuery(api.queries.message.list, { conversationId }) ?? [];
  const sendMessage = useMutation(api.mutations.message.send);
  const [newMessageText, setNewMessageText] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [streamedMessageId, setStreamedMessageId] =
    useState<Id<"messages"> | null>(null);

  const handleTranscript = (text: string) => {
    setNewMessageText((prev) => {
      if (prev) {
        return `${prev} ${text}`;
      }
      return text;
    });
  };

  async function handleGptResponse(
    onUpdate: (update: string) => void,
    requestBody: { messageId: Id<"messages">; messages: Doc<"messages">[] }
  ) {
    const convexSiteUrl = env.NEXT_PUBLIC_CONVEX_URL.replace(
      /\.cloud$/,
      ".site"
    );

    try {
      const response = await fetch(`${convexSiteUrl}/chat`, {
        method: "POST",
        body: JSON.stringify({ ...requestBody, conversationId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error(
          "Error response:",
          response.status,
          await response.text()
        );
        return;
      }

      const responseBody = response.body;
      if (responseBody === null) {
        console.error("No response body");
        return;
      }

      const reader = responseBody.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onUpdate(new TextDecoder().decode(value));
          return;
        }
        onUpdate(new TextDecoder().decode(value));
      }
    } catch (error) {
      console.error("Error in handleGptResponse:", error);
    }
  }

  // Don't render until we have a conversationId
  if (!conversationId) return null;

  return (
    <div className="flex flex-col gap-6">
      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await sendMessage({
            body: newMessageText,
            author: "user",
            conversationId,
          });
          setNewMessageText("");

          if (result !== null) {
            const messageId = result.messageId;
            setStreamedMessageId(messageId);
            await handleGptResponse((text) => {
              setStreamedMessage((p) => p + text);
            }, result);
          }
        }}
      >
        <Textarea
          name="message"
          rows={6}
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Describe your dream..."
          className="resize-none"
        />
        <div className="absolute bottom-2 right-2 flex gap-1">
          <SpeechToTextButton onTranscript={handleTranscript} />
          <Button type="submit" size="icon" disabled={!newMessageText.trim()}>
            <ArrowUpIcon size={18} />
          </Button>
        </div>
      </form>

      {messages.map((message) => {
        const messageText =
          streamedMessageId === message._id ? streamedMessage : message.body;
        return (
          <div
            key={message._id}
            className={cn(
              "flex flex-col items-start",
              message.author === "user" ? "items-end" : ""
            )}
          >
            <article
              className={cn(
                "group flex max-w-prose justify-start text-pretty rounded px-3 py-2",
                message.author === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              )}
            >
              <p>{messageText}</p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
