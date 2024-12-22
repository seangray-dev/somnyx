"use client";

import { useEffect, useState } from "react";

import { useMutation } from "convex/react";
import { ArrowUpIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/config/env/client";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SpeechToTextButton from "@/features/free-analysis/components/speech-to-text-button";
import { cn } from "@/lib/utils";

import useMessagesQuery from "../api/use-messages-query";

export default function Analysis() {
  const { data: messages, conversationId } = useMessagesQuery();
  const sendMessage = useMutation(api.mutations.message.send);
  const [newMessageText, setNewMessageText] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [streamedMessageId, setStreamedMessageId] =
    useState<Id<"messages"> | null>(null);

  useEffect(() => {
    const message = messages.find((m) => m._id === streamedMessageId);
    if (message !== undefined && message.isComplete) {
      // Clear what we streamed in favor of the complete message
      setStreamedMessageId(null);
      setStreamedMessage("");
    }
  }, [messages, setStreamedMessage, setStreamedMessageId]);

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = response.body;
      if (responseBody === null) {
        throw new Error("No response body");
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
      toast.error("An error occurred while interpreting your dream.");
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check rate limit first

    try {
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
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send your dream. Please try again.");
    }
  };

  if (!conversationId) return null;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="relative">
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

      {messages.map((message) => (
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
            <p>
              {message._id === streamedMessageId
                ? streamedMessage
                : message.body}
            </p>
          </article>
        </div>
      ))}
    </div>
  );
}
