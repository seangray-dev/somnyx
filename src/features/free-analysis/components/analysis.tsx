"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useMutation } from "convex/react";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/config/env/client";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import useMessagesQuery from "../api/use-messages-query";

export default function Analysis() {
  const { data: messages, conversationId } = useMessagesQuery();
  const sendMessage = useMutation(api.mutations.message.send);
  const [newMessageText, setNewMessageText] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [streamedMessageId, setStreamedMessageId] =
    useState<Id<"messages"> | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRequest, setLastRequest] = useState<{
    messageId: Id<"messages">;
    messages: Doc<"messages">[];
  } | null>(null);
  const DAILY_LIMIT = 2;
  const textareaId = useId();
  const messagesId = useId();

  const formatResetTime = (resetTime: string) => {
    try {
      const date = new Date(resetTime);
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
    } catch (e) {
      return resetTime;
    }
  };

  const handleGptResponse = useCallback(
    async (
      onUpdate: (update: string) => void,
      requestBody: { messageId: Id<"messages">; messages: Doc<"messages">[] }
    ) => {
      const convexSiteUrl = env.NEXT_PUBLIC_CONVEX_URL.replace(
        /\.cloud$/,
        ".site"
      );

      try {
        console.log("[Rate Limit] Sending request...");
        const response = await fetch(`${convexSiteUrl}/chat`, {
          method: "POST",
          body: JSON.stringify({ ...requestBody, conversationId }),
          headers: { "Content-Type": "application/json" },
        });

        console.log("[Rate Limit] Headers:", {
          limit: response.headers.get("X-RateLimit-Limit"),
          remaining: response.headers.get("X-RateLimit-Remaining"),
          reset: response.headers.get("X-RateLimit-Reset"),
        });

        if (!response.ok) {
          if (response.status === 429) {
            const error = await response.json();
            toast.error(error.message, {
              duration: 5000,
            });
            setIsSubmitting(false);
            return;
          }
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
        setIsSubmitting(false);

        // Store last request for retry functionality
        setLastRequest(requestBody);

        if (error instanceof TypeError && error.message.includes("fetch")) {
          toast.error("Network error. Please check your connection.", {
            duration: 6000,
            action: {
              label: "Retry",
              onClick: () => {
                if (lastRequest) {
                  setIsSubmitting(true);
                  handleGptResponse(
                    (text) => setStreamedMessage((p) => p + text),
                    lastRequest
                  );
                }
              },
            },
          });
        } else if (
          error instanceof Error &&
          error.message.includes("No response body")
        ) {
          toast.error("The server response was empty. Please try again.", {
            duration: 6000,
            action: {
              label: "Retry",
              onClick: () => {
                if (lastRequest) {
                  setIsSubmitting(true);
                  handleGptResponse(
                    (text) => setStreamedMessage((p) => p + text),
                    lastRequest
                  );
                }
              },
            },
          });
        } else {
          toast.error("An error occurred while interpreting your dream.", {
            duration: 6000,
            action: {
              label: "Try Again",
              onClick: () => {
                if (lastRequest) {
                  setIsSubmitting(true);
                  handleGptResponse(
                    (text) => setStreamedMessage((p) => p + text),
                    lastRequest
                  );
                }
              },
            },
          });
        }
      }
    },
    [conversationId, lastRequest]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || isRecording || !newMessageText.trim()) {
      return;
    }

    setIsSubmitting(true);

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
        setLastRequest(result);
        await handleGptResponse((text) => {
          setStreamedMessage((p) => p + text);
        }, result);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setIsSubmitting(false);
      toast.error("Failed to send your dream. Please try again.", {
        duration: 6000,
        action: {
          label: "Retry",
          onClick: () => {
            if (newMessageText) {
              handleSubmit(e);
            }
          },
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      setIsSubmitting(false);
      setStreamedMessageId(null);
      setStreamedMessage("");
      setIsRecording(false);
    };
  }, []);

  const isButtonDisabled =
    !newMessageText.trim() || isRecording || isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
          aria-label="Dream analysis form"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor={textareaId} className="sr-only">
              Describe your dream
            </label>
            <Textarea
              id={textareaId}
              ref={textareaRef}
              name="message"
              rows={6}
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Describe your dream..."
              className="resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="relative flex items-center gap-2"
              aria-label={
                isSubmitting
                  ? "Analyzing your dream..."
                  : "Submit dream for analysis"
              }
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Analyzing your dream...</span>
                </>
              ) : (
                <>
                  <SparklesIcon size={18} aria-hidden="true" />
                  <span>Interpret</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div
        id={messagesId}
        className="flex flex-col gap-4"
        role="log"
        aria-label="Dream analysis conversation"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={cn(
              "flex flex-col items-start",
              message.author === "user" ? "items-end" : ""
            )}
            role="article"
            aria-label={`${message.author === "user" ? "Your dream" : "Analysis"}`}
            tabIndex={0}
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
                {message._id === streamedMessageId && !message.isComplete ? (
                  <>
                    {streamedMessage}
                    <span className="sr-only">(Analysis in progress...)</span>
                  </>
                ) : (
                  message.body
                )}
              </p>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
